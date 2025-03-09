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