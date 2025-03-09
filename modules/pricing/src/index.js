/**
 * מודול תמחור
 * 
 * מודול זה אחראי על המרת כמויות לתמחור, עם תמיכה בשיטות מדידה שונות (יחידה/מ"ר)
 * ויצירת הצעות מחיר מפורטות ללקוחות.
 */

const { calculateItemPrices } = require('./item-pricing');
const { calculateLabor } = require('./labor-calculator');
const { applyDiscounts } = require('./discount-calculator');
const { applyOverhead } = require('./overhead-calculator');
const { applyTaxes } = require('./tax-calculator');
const { roundPrices } = require('./price-utils');

/**
 * חישוב מחיר מפורט לפרויקט על בסיס כמויות חומרים
 * @param {Object} materials כמויות החומרים כפי שחושבו במודול חישוב חומרים
 * @param {Object} priceData נתוני מחירים
 * @param {Object} options אפשרויות נוספות
 * @returns {Object} תמחור מפורט של הפרויקט
 */
function calculateProjectPrice(materials, priceData, options = {}) {
  try {
    // יצירת אובייקט לשמירת תוצאות התמחור
    const pricing = {
      // תמחור חומרים לפי קטגוריה
      materials: {},
      
      // תמחור עבודה
      labor: {},
      
      // הנחות
      discounts: {},
      
      // תקורות והוצאות נוספות
      overhead: {},
      
      // מסים (מע"מ וכו')
      taxes: {},
      
      // סיכומים
      totals: {
        materials: 0,
        labor: 0,
        overhead: 0,
        beforeTax: 0,
        tax: 0,
        afterTax: 0,
        finalPrice: 0
      },
      
      // מטא-נתונים
      metadata: {
        generatedAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).toISOString(), // תוקף להצעה - 30 יום
        projectType: options.projectType || 'residential',
        currencySymbol: options.currencySymbol || '₪',
        currencyCode: options.currencyCode || 'ILS'
      }
    };
    
    // חישוב מחירי החומרים
    pricing.materials = calculateItemPrices(materials, priceData.materials, options);
    
    // חישוב עלויות עבודה
    pricing.labor = calculateLabor(materials, priceData.labor, options);
    
    // חישוב הנחות (אם יש)
    pricing.discounts = applyDiscounts(
      pricing.materials, 
      pricing.labor, 
      options.discounts || {},
      options
    );
    
    // חישוב תקורות והוצאות נוספות
    pricing.overhead = applyOverhead(
      pricing.materials,
      pricing.labor, 
      priceData.overhead || {},
      options
    );
    
    // חישוב סיכומי ביניים
    pricing.totals.materials = sumCategoryPrices(pricing.materials);
    pricing.totals.labor = sumCategoryPrices(pricing.labor);
    pricing.totals.overhead = sumCategoryPrices(pricing.overhead);
    
    // חישוב סך הכל לפני מע"מ
    pricing.totals.beforeTax = pricing.totals.materials + 
                              pricing.totals.labor + 
                              pricing.totals.overhead - 
                              (pricing.discounts.total || 0);
    
    // חישוב מסים
    pricing.taxes = applyTaxes(pricing.totals.beforeTax, priceData.taxes || {}, options);
    pricing.totals.tax = pricing.taxes.total || 0;
    
    // חישוב סך הכל אחרי מע"מ
    pricing.totals.afterTax = pricing.totals.beforeTax + pricing.totals.tax;
    
    // עיגול המחיר הסופי
    pricing.totals.finalPrice = roundPrices(pricing.totals.afterTax, options.roundTo || 100);
    
    return pricing;
  } catch (error) {
    console.error('שגיאה בחישוב מחיר הפרויקט:', error);
    throw new Error(`שגיאה בחישוב מחיר: ${error.message}`);
  }
}

/**
 * סכימת מחירים בקטגוריה
 * @param {Object} categoryPrices אובייקט מחירי קטגוריה
 * @returns {number} הסכום הכולל
 */
function sumCategoryPrices(categoryPrices) {
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
        total += sumCategoryPrices(categoryPrices[key]);
      }
    }
  }
  
  return total;
}

/**
 * יצירת הצעת מחיר מלאה למסירה ללקוח
 * @param {Object} pricing תוצאות התמחור
 * @param {Object} clientData נתוני לקוח
 * @param {Object} projectData נתוני פרויקט
 * @param {Object} options אפשרויות נוספות
 * @returns {Object} הצעת מחיר מלאה
 */
function generatePriceQuote(pricing, clientData, projectData, options = {}) {
  try {
    // יצירת מבנה הצעת מחיר מלאה
    const priceQuote = {
      // פרטי לקוח
      client: { ...clientData },
      
      // פרטי פרויקט
      project: { ...projectData },
      
      // פירוט מחירים (מתוך אובייקט התמחור)
      pricing: {
        items: generateItemsBreakdown(pricing, options),
        totals: { ...pricing.totals },
        taxes: { ...pricing.taxes }
      },
      
      // תנאים והערות
      terms: generateTermsAndConditions(options),
      
      // פרטי תוקף והגשה
      metadata: {
        quoteNumber: generateQuoteNumber(clientData, projectData),
        generatedAt: new Date().toISOString(),
        validUntil: pricing.metadata.validUntil,
        preparedBy: options.preparedBy || "יאיר קבלן",
        currencySymbol: pricing.metadata.currencySymbol,
        currencyCode: pricing.metadata.currencyCode
      }
    };
    
    return priceQuote;
  } catch (error) {
    console.error('שגיאה ביצירת הצעת מחיר:', error);
    throw new Error(`שגיאה ביצירת הצעת מחיר: ${error.message}`);
  }
}

/**
 * יצירת פירוט פריטים להצעת המחיר
 * @param {Object} pricing תוצאות התמחור
 * @param {Object} options אפשרויות
 * @returns {Array} פירוט פריטים
 */
function generateItemsBreakdown(pricing, options = {}) {
  const items = [];
  
  // פירוט חומרים
  Object.entries(pricing.materials).forEach(([category, categoryPrices]) => {
    if (category === 'total') return;
    
    // הוספת קטגוריה
    if (typeof categoryPrices === 'object') {
      Object.entries(categoryPrices).forEach(([itemName, itemData]) => {
        if (itemName === 'total') return;
        
        // הוספת פריט
        if (typeof itemData === 'object' && itemData.price !== undefined) {
          items.push({
            category: getHebrewCategoryName(category),
            name: getHebrewItemName(itemName),
            quantity: itemData.quantity || 0,
            unit: itemData.unit || 'יח\'',
            unitPrice: itemData.unitPrice || 0,
            price: itemData.price || 0,
            notes: itemData.notes || ''
          });
        }
      });
    }
  });
  
  // פירוט עבודה
  Object.entries(pricing.labor).forEach(([category, categoryPrices]) => {
    if (category === 'total') return;
    
    // הוספת קטגוריה
    if (typeof categoryPrices === 'object') {
      Object.entries(categoryPrices).forEach(([itemName, itemData]) => {
        if (itemName === 'total') return;
        
        // הוספת פריט
        if (typeof itemData === 'object' && itemData.price !== undefined) {
          items.push({
            category: 'עבודה - ' + getHebrewCategoryName(category),
            name: getHebrewItemName(itemName),
            quantity: itemData.quantity || 0,
            unit: itemData.unit || 'יח\'',
            unitPrice: itemData.unitPrice || 0,
            price: itemData.price || 0,
            notes: itemData.notes || ''
          });
        }
      });
    }
  });
  
  return items;
}

/**
 * המרה לשמות קטגוריות בעברית
 * @param {string} category קטגוריה באנגלית
 * @returns {string} קטגוריה בעברית
 */
function getHebrewCategoryName(category) {
  const categoryMap = {
    drywall: 'גבס',
    concrete: 'בטון',
    floors: 'ריצוף',
    sealing: 'איטום',
    electricity: 'חשמל',
    plumbing: 'אינסטלציה',
    hardware: 'פרזול',
    painting: 'צבע',
    carpentry: 'נגרות',
    aluminum: 'אלומיניום',
    foundation: 'יסודות',
    frame: 'שלד',
    finishing: 'גמר',
    systems: 'מערכות'
  };
  
  return categoryMap[category] || category;
}

/**
 * המרה לשמות פריטים בעברית
 * @param {string} itemName שם פריט באנגלית
 * @returns {string} שם פריט בעברית
 */
function getHebrewItemName(itemName) {
  const itemMap = {
    yellow: 'גבס צהוב (דנס גלאס)',
    pink: 'גבס ורוד (עמיד אש)',
    blue: 'גבס כחול (עמיד מים)',
    accessories: 'אביזרים נלווים',
    screws: 'ברגים',
    tape: 'סרט',
    joint_compound: 'שפכטל',
    profiles: 'פרופילים',
    foundation: 'יסודות',
    floor: 'רצפה',
    walls: 'קירות',
    roof: 'גג',
    indoor: 'פנים',
    outdoor: 'חוץ',
    bathroom: 'חדר רחצה',
    units: 'יחידות',
    areas: 'שטחים',
    points: 'נקודות',
    doors: 'דלתות',
    windows: 'חלונות',
    light: 'נקודות מאור',
    power: 'שקעי כוח',
    water: 'מים',
    sewer: 'ביוב'
  };
  
  return itemMap[itemName] || itemName;
}

/**
 * יצירת תנאים והערות להצעת המחיר
 * @param {Object} options אפשרויות
 * @returns {Object} תנאים והערות
 */
function generateTermsAndConditions(options = {}) {
  return {
    validity: 'הצעת מחיר זו בתוקף ל-30 יום מיום הוצאתה',
    payment: 'תנאי תשלום: 30% מקדמה, 30% באמצע העבודה, 40% בסיום העבודה',
    exclusions: [
      'עבודות פיתוח חוץ',
      'אגרות והיטלים',
      'ריהוט וציוד',
      'מוצרי חשמל',
      'עבודות גינון'
    ],
    schedule: 'לוח זמנים משוער לביצוע: 4-6 חודשים מיום קבלת היתר בנייה',
    notes: options.notes || []
  };
}

/**
 * יצירת מספר הצעת מחיר ייחודי
 * @param {Object} clientData נתוני לקוח
 * @param {Object} projectData נתוני פרויקט
 * @returns {string} מספר הצעת מחיר
 */
function generateQuoteNumber(clientData, projectData) {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const clientInitials = clientData.name ? clientData.name.split(' ').map(word => word[0]).join('') : 'XX';
  
  return `${year}${month}-${clientInitials}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
}

module.exports = {
  calculateProjectPrice,
  generatePriceQuote
};