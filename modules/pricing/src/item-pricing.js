/**
 * מודול תמחור פריטים
 * 
 * מודול זה אחראי על המרת כמויות חומרים למחירים, עם התחשבות בשיטות מדידה שונות
 * ותעריפים שונים לפי סוג עבודה וחומר.
 */

/**
 * חישוב מחירי פריטים על בסיס כמויות חומרים
 * @param {Object} materials כמויות החומרים כפי שחושבו במודול חישוב חומרים
 * @param {Object} priceData נתוני מחירים
 * @param {Object} options אפשרויות נוספות
 * @returns {Object} מחירי החומרים המחושבים
 */
function calculateItemPrices(materials, priceData, options = {}) {
  try {
    // יצירת אובייקט לשמירת תוצאות התמחור
    const materialsPrice = {};
    
    // תמחור גבס לפי סוגים
    materialsPrice.drywall = calculateDrywallPrices(materials.drywall, priceData.drywall, options);
    
    // תמחור בטון
    materialsPrice.concrete = calculateConcretePrices(materials.concrete, priceData.concrete, options);
    
    // תמחור ריצוף
    materialsPrice.floors = calculateFlooringPrices(materials.floors, priceData.floors, options);
    
    // תמחור איטום
    materialsPrice.sealing = calculateSealingPrices(materials.sealing, priceData.sealing, options);
    
    // תמחור חשמל
    materialsPrice.electricity = calculateElectricityPrices(materials.electricity, priceData.electricity, options);
    
    // תמחור אינסטלציה
    materialsPrice.plumbing = calculatePlumbingPrices(materials.plumbing, priceData.plumbing, options);
    
    // תמחור פרזול וגימור
    materialsPrice.hardware = calculateHardwarePrices(materials.hardware, priceData.hardware, options);
    
    // חישוב סך הכל
    materialsPrice.total = calculateTotalMaterialsPrice(materialsPrice);
    
    return materialsPrice;
  } catch (error) {
    console.error('שגיאה בחישוב מחירי פריטים:', error);
    throw new Error(`שגיאה בחישוב מחירי פריטים: ${error.message}`);
  }
}

/**
 * חישוב מחירי גבס
 * @param {Object} drywallMaterials כמויות גבס
 * @param {Object} drywallPrices מחירי גבס
 * @param {Object} options אפשרויות נוספות
 * @returns {Object} מחירי גבס מחושבים
 */
function calculateDrywallPrices(drywallMaterials, drywallPrices, options = {}) {
  // בדיקה שיש נתונים
  if (!drywallMaterials || !drywallPrices) {
    return { total: 0 };
  }
  
  const drywallPricing = {};
  
  // תמחור גבס צהוב (דנס גלאס)
  if (drywallMaterials.yellow) {
    drywallPricing.yellow = {
      quantity: drywallMaterials.yellow.sheets,
      unit: 'לוח',
      unitPrice: drywallPrices.yellow.sheetPrice || 0,
      price: drywallMaterials.yellow.sheets * (drywallPrices.yellow.sheetPrice || 0),
      notes: `${drywallMaterials.yellow.sqm} מ"ר גבס צהוב לקירות חוץ`
    };
  }
  
  // תמחור גבס ורוד (עמיד אש)
  if (drywallMaterials.pink) {
    drywallPricing.pink = {
      quantity: drywallMaterials.pink.sheets,
      unit: 'לוח',
      unitPrice: drywallPrices.pink.sheetPrice || 0,
      price: drywallMaterials.pink.sheets * (drywallPrices.pink.sheetPrice || 0),
      notes: `${drywallMaterials.pink.sqm} מ"ר גבס ורוד לקירות פנים`
    };
  }
  
  // תמחור גבס כחול (עמיד מים)
  if (drywallMaterials.blue) {
    drywallPricing.blue = {
      quantity: drywallMaterials.blue.sheets,
      unit: 'לוח',
      unitPrice: drywallPrices.blue.sheetPrice || 0,
      price: drywallMaterials.blue.sheets * (drywallPrices.blue.sheetPrice || 0),
      notes: `${drywallMaterials.blue.sqm} מ"ר גבס כחול לחדרים רטובים`
    };
  }
  
  // תמחור אביזרים נלווים
  if (drywallMaterials.accessories) {
    drywallPricing.accessories = {};
    
    // ברגים
    if (drywallMaterials.accessories.screws) {
      drywallPricing.accessories.screws = {
        quantity: Math.ceil(drywallMaterials.accessories.screws / 1000), // חבילות של 1000
        unit: 'חבילה',
        unitPrice: drywallPrices.accessories.screwsPackPrice || 0,
        price: Math.ceil(drywallMaterials.accessories.screws / 1000) * (drywallPrices.accessories.screwsPackPrice || 0),
        notes: 'חבילות של 1000 ברגים'
      };
    }
    
    // סרט
    if (drywallMaterials.accessories.tape) {
      drywallPricing.accessories.tape = {
        quantity: Math.ceil(drywallMaterials.accessories.tape / 90), // גלילים של 90 מטר
        unit: 'גליל',
        unitPrice: drywallPrices.accessories.tapeRollPrice || 0,
        price: Math.ceil(drywallMaterials.accessories.tape / 90) * (drywallPrices.accessories.tapeRollPrice || 0),
        notes: 'גלילים של 90 מטר'
      };
    }
    
    // שפכטל
    if (drywallMaterials.accessories.joint_compound) {
      drywallPricing.accessories.joint_compound = {
        quantity: drywallMaterials.accessories.joint_compound,
        unit: 'ק"ג',
        unitPrice: drywallPrices.accessories.jointCompoundKgPrice || 0,
        price: drywallMaterials.accessories.joint_compound * (drywallPrices.accessories.jointCompoundKgPrice || 0),
        notes: 'שפכטל לגבס'
      };
    }
    
    // פרופילים
    if (drywallMaterials.accessories.profiles) {
      drywallPricing.accessories.profiles = {};
      
      // פרופילי C60
      if (drywallMaterials.accessories.profiles.c60) {
        drywallPricing.accessories.profiles.c60 = {
          quantity: drywallMaterials.accessories.profiles.c60,
          unit: 'מטר',
          unitPrice: drywallPrices.accessories.profiles.c60MeterPrice || 0,
          price: drywallMaterials.accessories.profiles.c60 * (drywallPrices.accessories.profiles.c60MeterPrice || 0),
          notes: 'פרופילי C60'
        };
      }
      
      // פרופילי U50
      if (drywallMaterials.accessories.profiles.u50) {
        drywallPricing.accessories.profiles.u50 = {
          quantity: drywallMaterials.accessories.profiles.u50,
          unit: 'מטר',
          unitPrice: drywallPrices.accessories.profiles.u50MeterPrice || 0,
          price: drywallMaterials.accessories.profiles.u50 * (drywallPrices.accessories.profiles.u50MeterPrice || 0),
          notes: 'פרופילי U50'
        };
      }
    }
  }
  
  // חישוב סך הכל לגבס
  drywallPricing.total = calculateCategoryTotal(drywallPricing);
  
  return drywallPricing;
}

/**
 * חישוב מחירי בטון
 * @param {Object} concreteMaterials כמויות בטון
 * @param {Object} concretePrices מחירי בטון
 * @param {Object} options אפשרויות נוספות
 * @returns {Object} מחירי בטון מחושבים
 */
function calculateConcretePrices(concreteMaterials, concretePrices, options = {}) {
  // בדיקה שיש נתונים
  if (!concreteMaterials || !concretePrices) {
    return { total: 0 };
  }
  
  const concretePricing = {};
  
  // תמחור בטון לפי נפחים וסוגים
  if (concreteMaterials.volumes) {
    concretePricing.volumes = {};
    
    // יסודות
    if (concreteMaterials.volumes.foundation) {
      concretePricing.volumes.foundation = {
        quantity: concreteMaterials.volumes.foundation,
        unit: 'מ"ק',
        unitPrice: concretePrices.cubic.foundation || 0,
        price: concreteMaterials.volumes.foundation * (concretePrices.cubic.foundation || 0),
        notes: 'בטון ליסודות וקלונסאות'
      };
    }
    
    // רצפה
    if (concreteMaterials.volumes.floor) {
      concretePricing.volumes.floor = {
        quantity: concreteMaterials.volumes.floor,
        unit: 'מ"ק',
        unitPrice: concretePrices.cubic.floor || 0,
        price: concreteMaterials.volumes.floor * (concretePrices.cubic.floor || 0),
        notes: 'בטון לרצפות'
      };
    }
    
    // קירות
    if (concreteMaterials.volumes.walls) {
      concretePricing.volumes.walls = {
        quantity: concreteMaterials.volumes.walls,
        unit: 'מ"ק',
        unitPrice: concretePrices.cubic.walls || 0,
        price: concreteMaterials.volumes.walls * (concretePrices.cubic.walls || 0),
        notes: 'בטון לקירות'
      };
    }
    
    // גג
    if (concreteMaterials.volumes.roof) {
      concretePricing.volumes.roof = {
        quantity: concreteMaterials.volumes.roof,
        unit: 'מ"ק',
        unitPrice: concretePrices.cubic.roof || 0,
        price: concreteMaterials.volumes.roof * (concretePrices.cubic.roof || 0),
        notes: 'בטון לגגות ותקרות'
      };
    }
  }
  
  // תמחור זיון
  if (concreteMaterials.reinforcement) {
    concretePricing.reinforcement = {
      quantity: concreteMaterials.reinforcement,
      unit: 'ק"ג',
      unitPrice: concretePrices.reinforcementKgPrice || 0,
      price: concreteMaterials.reinforcement * (concretePrices.reinforcementKgPrice || 0),
      notes: 'ברזל זיון'
    };
  }
  
  // תמחור הובלת בטון (משאיות/מערבלים)
  if (concreteMaterials.truckLoads) {
    concretePricing.delivery = {
      quantity: concreteMaterials.truckLoads,
      unit: 'מערבל',
      unitPrice: concretePrices.truckLoadPrice || 0,
      price: concreteMaterials.truckLoads * (concretePrices.truckLoadPrice || 0),
      notes: 'הובלת בטון במערבלים'
    };
  }
  
  // חישוב סך הכל לבטון
  concretePricing.total = calculateCategoryTotal(concretePricing);
  
  return concretePricing;
}

/**
 * חישוב מחירי פרזול וגימור
 * @param {Object} hardwareMaterials כמויות פרזול וגימור
 * @param {Object} hardwarePrices מחירי פרזול וגימור
 * @param {Object} options אפשרויות נוספות
 * @returns {Object} מחירי פרזול וגימור מחושבים
 */
function calculateHardwarePrices(hardwareMaterials, hardwarePrices, options = {}) {
  // בדיקה שיש נתונים
  if (!hardwareMaterials || !hardwarePrices) {
    return { total: 0 };
  }
  
  const hardwarePricing = {};
  
  // תמחור פרזול לדלתות וחלונות
  if (hardwareMaterials.hardware) {
    hardwarePricing.hardware = {};
    
    // דלתות
    if (hardwareMaterials.hardware.doors) {
      hardwarePricing.hardware.doors = {
        quantity: hardwareMaterials.hardware.doors,
        unit: 'יח\'',
        unitPrice: hardwarePrices.hardware.doorUnitPrice || 0,
        price: hardwareMaterials.hardware.doors * (hardwarePrices.hardware.doorUnitPrice || 0),
        notes: 'פרזול לדלתות'
      };
    }
    
    // חלונות
    if (hardwareMaterials.hardware.windows) {
      hardwarePricing.hardware.windows = {
        quantity: hardwareMaterials.hardware.windows,
        unit: 'יח\'',
        unitPrice: hardwarePrices.hardware.windowUnitPrice || 0,
        price: hardwareMaterials.hardware.windows * (hardwarePrices.hardware.windowUnitPrice || 0),
        notes: 'פרזול לחלונות'
      };
    }
  }
  
  // תמחור ספי חלון
  if (hardwareMaterials.windowSills) {
    hardwarePricing.windowSills = {
      quantity: hardwareMaterials.windowSills.length,
      unit: 'מטר',
      unitPrice: hardwarePrices.windowSillMeterPrice || 0,
      price: hardwareMaterials.windowSills.length * (hardwarePrices.windowSillMeterPrice || 0),
      notes: `${hardwareMaterials.windowSills.count} ספי חלון`
    };
  }
  
  // חישוב סך הכל לפרזול וגימור
  hardwarePricing.total = calculateCategoryTotal(hardwarePricing);
  
  return hardwarePricing;
}

/**
 * חישוב סכום כולל של קטגוריה
 * @param {Object} categoryPrices אובייקט מחירי קטגוריה
 * @returns {number} הסכום הכולל
 */
function calculateCategoryTotal(categoryPrices) {
  let total = 0;
  
  for (const key in categoryPrices) {
    if (key === 'total') continue; // דילוג על שדה סיכום אם קיים
    
    if (typeof categoryPrices[key] === 'number') {
      total += categoryPrices[key];
    } else if (typeof categoryPrices[key] === 'object') {
      // רקורסיה עבור אוביקטים מקוננים
      if (categoryPrices[key].price !== undefined) {
        total += categoryPrices[key].price;
      } else {
        total += calculateCategoryTotal(categoryPrices[key]);
      }
    }
  }
  
  return total;
}

/**
 * חישוב סך כל מחירי החומרים
 * @param {Object} materialsPrice אובייקט מחירי החומרים
 * @returns {number} סך כל מחירי החומרים
 */
function calculateTotalMaterialsPrice(materialsPrice) {
  let total = 0;
  
  for (const category in materialsPrice) {
    if (category === 'total') continue; // דילוג על שדה סיכום אם קיים
    
    if (typeof materialsPrice[category] === 'object' && materialsPrice[category].total !== undefined) {
      total += materialsPrice[category].total;
    }
  }
  
  return total;
}

module.exports = {
  calculateItemPrices
};