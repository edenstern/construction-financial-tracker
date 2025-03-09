/**
 * מודול חישוב כמויות חומרים
 * 
 * מודול זה אחראי על חישוב כמויות החומרים הנדרשות לפרויקט בהתבסס על האלמנטים שזוהו בתכנית.
 */

/**
 * פונקציה לחישוב כמויות חומרים
 * @param {Object} elements האלמנטים שזוהו בתכנית
 * @param {Object} areas שטחים שחושבו
 * @param {Object} lengths אורכים שחושבו
 * @returns {Object} כמויות החומרים המחושבות
 */
function calculateMaterials(elements, areas, lengths) {
  try {
    const materials = {
      // כמויות גבס לפי סוגים
      drywall: calculateDrywallQuantities(elements),
      
      // כמויות בטון
      concrete: calculateConcreteQuantities(elements),
      
      // כמויות ריצוף
      floors: calculateFlooringQuantities(elements),
      
      // כמויות איטום (לפי יחידות וגם לפי מ"ר)
      sealing: calculateSealingQuantities(elements),
      
      // כמויות חשמל (לפי נקודה ו/או אורך)
      electricity: calculateElectricityQuantities(elements),
      
      // כמויות אינסטלציה (לפי נקודה ו/או אורך)
      plumbing: calculatePlumbingQuantities(elements),
      
      // כמויות פרזול וגימור
      hardware: calculateHardwareQuantities(elements)
    };
    
    return materials;
  } catch (error) {
    console.error('שגיאה בחישוב כמויות חומרים:', error);
    throw new Error(`שגיאה בחישוב כמויות חומרים: ${error.message}`);
  }
}

/**
 * חישוב כמויות לוחות גבס נדרשות
 * @param {Object} elements האלמנטים שזוהו בתכנית
 * @returns {Object} כמויות לוחות גבס לפי סוגים
 */
function calculateDrywallQuantities(elements) {
  // חישוב שטח לכל סוג קיר
  const outerWallsArea = elements.walls.outer.totalArea || 0;
  const innerWallsArea = elements.walls.inner.totalArea || 0;
  const bathroomWallsArea = elements.walls.bathroom.totalArea || 0;
  
  // שטח תקרות שדורשות גבס
  const ceilingsArea = (elements.ceilings && elements.ceilings.totalArea) || 0;
  
  // חישוב כמות לוחות גבס לפי סוג
  // גבס צהוב (דנס גלאס) לקירות חוץ
  const yellowDrywallSheets = calculateDrywallSheets(outerWallsArea, {
    sheetWidth: 1.2,     // רוחב לוח במטרים
    sheetHeight: 3.6,    // גובה לוח במטרים
    wasteFactor: 0.15    // מקדם פחת (15%)
  });
  
  // גבס ורוד (עמיד אש) לקירות פנים
  const pinkDrywallSheets = calculateDrywallSheets(innerWallsArea + ceilingsArea, {
    sheetWidth: 1.2,
    sheetHeight: 3.0,
    wasteFactor: 0.10
  });
  
  // גבס כחול (עמיד מים) לחדרים רטובים
  const blueDrywallSheets = calculateDrywallSheets(bathroomWallsArea, {
    sheetWidth: 1.2,
    sheetHeight: 2.4,
    wasteFactor: 0.12
  });
  
  return {
    // לוחות גבס לפי סוג
    yellow: {
      sheets: Math.ceil(yellowDrywallSheets),
      sqm: outerWallsArea,
      type: 'דנס גלאס צהוב'
    },
    pink: {
      sheets: Math.ceil(pinkDrywallSheets),
      sqm: innerWallsArea + ceilingsArea,
      type: 'גבס ורוד (עמיד אש)'
    },
    blue: {
      sheets: Math.ceil(blueDrywallSheets),
      sqm: bathroomWallsArea,
      type: 'גבס כחול (עמיד מים)'
    },
    
    // סיכום כולל
    total: {
      sheets: Math.ceil(yellowDrywallSheets + pinkDrywallSheets + blueDrywallSheets),
      sqm: outerWallsArea + innerWallsArea + bathroomWallsArea + ceilingsArea
    },
    
    // חומרים נלווים
    accessories: calculateDrywallAccessories(outerWallsArea + innerWallsArea + bathroomWallsArea + ceilingsArea)
  };
}

/**
 * חישוב מספר לוחות גבס הנדרשים לכיסוי שטח מסוים
 * @param {number} area השטח במ"ר
 * @param {Object} options אפשרויות חישוב
 * @returns {number} מספר הלוחות הנדרשים
 */
function calculateDrywallSheets(area, options = {}) {
  // ערכי ברירת מחדל
  const sheetWidth = options.sheetWidth || 1.2;  // מטרים
  const sheetHeight = options.sheetHeight || 2.4;  // מטרים
  const wasteFactor = options.wasteFactor || 0.1;  // 10% פחת
  
  // חישוב שטח לוח אחד
  const sheetArea = sheetWidth * sheetHeight;
  
  // חישוב מספר הלוחות כולל פחת
  const sheetsRequired = (area / sheetArea) * (1 + wasteFactor);
  
  return sheetsRequired;
}

/**
 * חישוב כמויות אביזרים נלווים לגבס
 * @param {number} totalDrywallArea סך שטח הגבס במ"ר
 * @returns {Object} כמויות אביזרים נלווים
 */
function calculateDrywallAccessories(totalDrywallArea) {
  return {
    screws: Math.ceil(totalDrywallArea * 15),  // 15 ברגים למ"ר
    tape: Math.ceil(totalDrywallArea * 0.8),   // 0.8 מטר סרט למ"ר
    joint_compound: Math.ceil(totalDrywallArea * 0.3),  // 0.3 ק"ג שפכטל למ"ר
    profiles: {
      c60: Math.ceil(totalDrywallArea * 1.2),  // פרופילי C60 במטרים
      u50: Math.ceil(totalDrywallArea * 0.5)   // פרופילי U50 במטרים
    }
  };
}

/**
 * חישוב כמויות בטון
 * @param {Object} elements האלמנטים שזוהו בתכנית
 * @returns {Object} כמויות בטון לפי סוג
 */
function calculateConcreteQuantities(elements) {
  // חישוב נפח בטון ליסודות
  const foundationVolume = calculateFoundationConcreteVolume(elements);
  
  // חישוב נפח בטון לרצפות
  const floorVolume = calculateFloorConcreteVolume(elements);
  
  // חישוב נפח בטון לקירות נושאים (אם יש)
  const wallsVolume = calculateWallsConcreteVolume(elements);
  
  // חישוב נפח בטון לתקרות/גגות
  const roofVolume = calculateRoofConcreteVolume(elements);
  
  // חישוב כמות הזיון (ברזל)
  const reinforcement = calculateReinforcementWeight(
    foundationVolume + floorVolume + wallsVolume + roofVolume
  );
  
  return {
    // נפחי בטון לפי סוג
    volumes: {
      foundation: foundationVolume,
      floor: floorVolume,
      walls: wallsVolume,
      roof: roofVolume,
      total: foundationVolume + floorVolume + wallsVolume + roofVolume
    },
    
    // כמות זיון
    reinforcement: reinforcement,
    
    // הערכת מספר משאיות/מערבלי בטון נדרשים
    truckLoads: calculateConcretetruckLoads(foundationVolume + floorVolume + wallsVolume + roofVolume)
  };
}

/**
 * חישוב כמויות ריצוף
 * @param {Object} elements האלמנטים שזוהו בתכנית
 * @returns {Object} כמויות ריצוף לפי סוג
 */
function calculateFlooringQuantities(elements) {
  // שטחי רצפה לפי סוג
  const indoorFloorArea = elements.floors.indoor.totalArea || 0;
  const outdoorFloorArea = elements.floors.outdoor.totalArea || 0;
  const bathroomFloorArea = elements.floors.bathroom.totalArea || 0;
  
  // חישוב כמות אריחים (ברירת מחדל: 60x60 ס"מ)
  const indoorTiles = calculateTiles(indoorFloorArea, { size: 0.6, wasteFactor: 0.08 });
  const outdoorTiles = calculateTiles(outdoorFloorArea, { size: 0.6, wasteFactor: 0.1 });
  const bathroomTiles = calculateTiles(bathroomFloorArea, { size: 0.6, wasteFactor: 0.12 });
  
  return {
    indoor: {
      area: indoorFloorArea,
      tiles: Math.ceil(indoorTiles),
      adhesive: Math.ceil(indoorFloorArea * 4.5),  // 4.5 ק"ג דבק למ"ר
      grout: Math.ceil(indoorFloorArea * 0.5)      // 0.5 ק"ג רובה למ"ר
    },
    outdoor: {
      area: outdoorFloorArea,
      tiles: Math.ceil(outdoorTiles),
      adhesive: Math.ceil(outdoorFloorArea * 5),   // 5 ק"ג דבק למ"ר
      grout: Math.ceil(outdoorFloorArea * 0.6)     // 0.6 ק"ג רובה למ"ר
    },
    bathroom: {
      area: bathroomFloorArea,
      tiles: Math.ceil(bathroomTiles),
      adhesive: Math.ceil(bathroomFloorArea * 5),  // 5 ק"ג דבק למ"ר
      grout: Math.ceil(bathroomFloorArea * 0.8)    // 0.8 ק"ג רובה למ"ר
    },
    total: {
      area: indoorFloorArea + outdoorFloorArea + bathroomFloorArea,
      tiles: Math.ceil(indoorTiles + outdoorTiles + bathroomTiles)
    }
  };
}

/**
 * חישוב כמויות איטום
 * @param {Object} elements האלמנטים שזוהו בתכנית
 * @returns {Object} כמויות חומרי איטום
 */
function calculateSealingQuantities(elements) {
  // חדרים רטובים - לפי יחידות
  const bathroomCount = (elements.specialRooms && elements.specialRooms.bathroom.count) || 0;
  
  // שטחי גגות/מרפסות - לפי מ"ר
  const roofArea = (elements.roofs && elements.roofs.totalArea) || 0;
  const outdoorArea = (elements.floors.outdoor.totalArea) || 0;
  
  // שטחי מרתף (אם קיים)
  const basementWallsArea = 0; // לא מחושב בדוגמה זו
  const basementFloorArea = 0; // לא מחושב בדוגמה זו
  
  return {
    // איטום לפי יחידה
    units: {
      bathroom: bathroomCount,
      cost_per_bathroom: 3000 // עלות איטום לחדר רטוב בש"ח
    },
    
    // איטום לפי שטח
    areas: {
      roof: {
        area: roofArea,
        material_sqm: Math.ceil(roofArea * 1.1) // 10% נוספים עבור חפיפות
      },
      outdoor: {
        area: outdoorArea,
        material_sqm: Math.ceil(outdoorArea * 1.1)
      },
      basement: {
        walls: basementWallsArea,
        floor: basementFloorArea,
        material_sqm: Math.ceil((basementWallsArea + basementFloorArea) * 1.15) // 15% נוספים
      }
    }
  };
}

/**
 * חישוב כמויות חשמל
 * @param {Object} elements האלמנטים שזוהו בתכנית
 * @returns {Object} כמויות חומרי חשמל
 */
function calculateElectricityQuantities(elements) {
  // חישוב מדומה של נקודות חשמל
  // במערכת אמיתית, יתבצע חישוב לפי תכנית חשמל
  
  // חישוב לפי שטח הבית
  const totalIndoorArea = (elements.floors.indoor.totalArea || 0) + (elements.floors.bathroom.totalArea || 0);
  
  // הערכת מספר נקודות לפי שטח
  const lightPoints = Math.ceil(totalIndoorArea * 0.5); // בממוצע 1 נקודת תאורה לכל 2 מ"ר
  const powerPoints = Math.ceil(totalIndoorArea * 0.7); // בממוצע 7 שקעים לכל 10 מ"ר
  
  return {
    // נקודות חשמל
    points: {
      light: lightPoints,
      power: powerPoints,
      communication: Math.ceil(totalIndoorArea * 0.2), // בממוצע 1 נקודת תקשורת לכל 5 מ"ר
      total: lightPoints + powerPoints + Math.ceil(totalIndoorArea * 0.2)
    },
    
    // אורך מוערך של צנרת וכבלים
    cabling: {
      meters: Math.ceil(totalIndoorArea * 3) // בממוצע 3 מטר כבל למ"ר
    }
  };
}

/**
 * חישוב כמויות אינסטלציה
 * @param {Object} elements האלמנטים שזוהו בתכנית
 * @returns {Object} כמויות חומרי אינסטלציה
 */
function calculatePlumbingQuantities(elements) {
  // חישוב מדומה של נקודות אינסטלציה
  // במערכת אמיתית, יתבצע חישוב לפי תכנית אינסטלציה
  
  // חישוב לפי מספר החדרים הרטובים
  const bathroomCount = (elements.specialRooms && elements.specialRooms.bathroom.count) || 0;
  const kitchenCount = (elements.specialRooms && elements.specialRooms.kitchen.count) || 0;
  
  // חישוב נקודות מים חמים/קרים
  const waterPoints = bathroomCount * 5 + kitchenCount * 2; // בממוצע 5 נקודות לחדר אמבטיה, 2 למטבח
  
  // חישוב נקודות ביוב
  const sewerPoints = bathroomCount * 3 + kitchenCount * 1; // בממוצע 3 נקודות לחדר אמבטיה, 1 למטבח
  
  return {
    // נקודות אינסטלציה
    points: {
      water: {
        hot: waterPoints / 2, // בערך חצי מהנקודות הן למים חמים
        cold: waterPoints,     // כל הנקודות צריכות מים קרים
        total: waterPoints + (waterPoints / 2)
      },
      sewer: sewerPoints
    },
    
    // שוחות ביוב
    sewerAccessPoints: Math.ceil(sewerPoints * 0.5), // בממוצע שוחה אחת לכל 2 נקודות ביוב
    
    // אורך מוערך של צנרת
    piping: {
      water: Math.ceil((waterPoints + (waterPoints / 2)) * 3), // בממוצע 3 מטר צנרת לכל נקודה
      sewer: Math.ceil(sewerPoints * 2) // בממוצע 2 מטר צנרת לכל נקודת ביוב
    }
  };
}

/**
 * חישוב כמויות פרזול וגימור
 * @param {Object} elements האלמנטים שזוהו בתכנית
 * @returns {Object} כמויות חומרי פרזול וגימור
 */
function calculateHardwareQuantities(elements) {
  // חישוב מדומה של פרזול
  
  // חלונות ודלתות
  const windowCount = (elements.openings && elements.openings.windows.count) || 0;
  const doorCount = (elements.openings && elements.openings.doors.count) || 0;
  
  // אורך ספי חלון
  const windowSillLength = windowCount * 1.2; // בממוצע 1.2 מטר לחלון
  
  return {
    // פרזול חלונות ודלתות
    hardware: {
      doors: doorCount,
      windows: windowCount
    },
    
    // ספי חלון
    windowSills: {
      count: windowCount,
      length: windowSillLength
    }
  };
}

// פונקציות עזר לחישוב בטון ומדרגות
function calculateFoundationConcreteVolume(elements) {
  // חישוב מדומה - בפועל יחושב לפי תכנית קונסטרוקציה
  return 20; // נפח במ"ק
}

function calculateFloorConcreteVolume(elements) {
  // חישוב מדומה - בפועל יחושב לפי תכנית קונסטרוקציה
  return 30; // נפח במ"ק
}

function calculateWallsConcreteVolume(elements) {
  // חישוב מדומה - בפועל יחושב לפי תכנית קונסטרוקציה
  return 0; // בבנייה בטכנולוגיית גבס, בדרך כלל אין קירות בטון
}

function calculateRoofConcreteVolume(elements) {
  // חישוב מדומה - בפועל יחושב לפי תכנית קונסטרוקציה
  return 15; // נפח במ"ק
}

function calculateReinforcementWeight(totalConcreteVolume) {
  // בממוצע 100 ק"ג ברזל למ"ק בטון
  return totalConcreteVolume * 100;
}

function calculateConcretetruckLoads(totalConcreteVolume) {
  // מערבל בטון סטנדרטי מכיל כ-9 מ"ק
  return Math.ceil(totalConcreteVolume / 9);
}

// פונקציות עזר לחישוב ריצוף
function calculateTiles(area, options = {}) {
  // ערכי ברירת מחדל
  const tileSize = options.size || 0.6; // מטרים (60x60 ס"מ)
  const wasteFactor = options.wasteFactor || 0.08; // 8% פחת
  
  // חישוב שטח אריח אחד
  const tileArea = tileSize * tileSize;
  
  // חישוב מספר האריחים כולל פחת
  const tilesRequired = (area / tileArea) * (1 + wasteFactor);
  
  return tilesRequired;
}

module.exports = {
  calculateMaterials
};
