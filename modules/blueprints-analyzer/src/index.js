/**
 * מודול ניתוח תכניות
 * 
 * מודול זה אחראי על ניתוח תכניות אדריכליות, חישוב שטחים, אורכים וכמויות חומרים.
 * הוא מהווה את הבסיס לתמחור אוטומטי של פרויקטים בהתבסס על תכניות.
 */

const { readPDFFile } = require('./pdf-reader');
const { readDWGFile } = require('./dwg-reader');
const { identifyElements } = require('./element-identifier');
const { calculateAreas } = require('./area-calculator');
const { calculateLengths } = require('./length-calculator');
const { calculateMaterials } = require('./materials-calculator');
const { detectMissingInfo } = require('./missing-info-detector');

/**
 * מנתח תכנית ומחשב כמויות
 * @param {string} filePath נתיב לקובץ התכנית
 * @param {Object} options אפשרויות נוספות
 * @returns {Promise<Object>} תוצאות הניתוח
 */
async function analyzeBlueprint(filePath, options = {}) {
  try {
    // זיהוי סוג הקובץ וקריאתו
    let blueprintData;
    if (filePath.toLowerCase().endsWith('.pdf')) {
      blueprintData = await readPDFFile(filePath);
    } else if (filePath.toLowerCase().endsWith('.dwg')) {
      blueprintData = await readDWGFile(filePath);
    } else {
      throw new Error('פורמט קובץ לא נתמך. המערכת תומכת בקבצי PDF ו-DWG');
    }

    // זיהוי אלמנטים בתכנית
    const elements = await identifyElements(blueprintData, options);

    // חישוב שטחים
    const areas = calculateAreas(elements);

    // חישוב אורכים
    const lengths = calculateLengths(elements);

    // חישוב כמויות חומרים
    const materials = calculateMaterials(elements, areas, lengths);

    // זיהוי חוסרים ובעיות בתכנית
    const warnings = detectMissingInfo(elements, blueprintData);

    return {
      elements,
      areas,
      lengths,
      materials,
      warnings,
      metadata: {
        filename: filePath,
        analyzedAt: new Date().toISOString(),
        fileType: filePath.split('.').pop().toLowerCase()
      }
    };
  } catch (error) {
    console.error('שגיאה בניתוח התכנית:', error);
    throw new Error(`שגיאה בניתוח תכנית: ${error.message}`);
  }
}

/**
 * מנתח רשימת תכניות ומאחד את התוצאות
 * @param {string[]} filePaths רשימת נתיבים לקבצי תכניות
 * @param {Object} options אפשרויות נוספות
 * @returns {Promise<Object>} תוצאות ניתוח מאוחדות
 */
async function analyzeBlueprintSet(filePaths, options = {}) {
  const results = await Promise.all(
    filePaths.map(filePath => analyzeBlueprint(filePath, options))
  );

  // איחוד תוצאות מכל התכניות
  const combined = {
    elements: {},
    areas: { total: { floor: 0, walls: 0, roof: 0, bathroom: 0, outdoor: 0 } },
    lengths: { total: { outerWalls: 0, innerWalls: 0, windows: 0 } },
    materials: {
      drywall: { yellow: 0, pink: 0, blue: 0 },
      concrete: 0,
      floors: { indoor: 0, outdoor: 0 },
      total: {}
    },
    warnings: [],
    metadata: {
      fileCount: filePaths.length,
      analyzedAt: new Date().toISOString()
    }
  };

  // איחוד הנתונים מכל התכניות
  results.forEach(result => {
    // איחוד שטחים
    Object.keys(result.areas).forEach(areaType => {
      if (typeof result.areas[areaType] === 'number') {
        combined.areas.total[areaType] = (combined.areas.total[areaType] || 0) + result.areas[areaType];
      }
    });

    // איחוד אורכים
    Object.keys(result.lengths).forEach(lengthType => {
      if (typeof result.lengths[lengthType] === 'number') {
        combined.lengths.total[lengthType] = (combined.lengths.total[lengthType] || 0) + result.lengths[lengthType];
      }
    });

    // איחוד כמויות חומרים
    Object.keys(result.materials).forEach(materialType => {
      if (typeof result.materials[materialType] === 'number') {
        combined.materials.total[materialType] = (combined.materials.total[materialType] || 0) + result.materials[materialType];
      } else if (typeof result.materials[materialType] === 'object') {
        Object.keys(result.materials[materialType]).forEach(subType => {
          if (!combined.materials.total[materialType]) {
            combined.materials.total[materialType] = {};
          }
          combined.materials.total[materialType][subType] = (combined.materials.total[materialType][subType] || 0) + 
                                                           result.materials[materialType][subType];
        });
      }
    });

    // איחוד אזהרות
    combined.warnings = [...combined.warnings, ...result.warnings];
  });

  return combined;
}

module.exports = {
  analyzeBlueprint,
  analyzeBlueprintSet
};
