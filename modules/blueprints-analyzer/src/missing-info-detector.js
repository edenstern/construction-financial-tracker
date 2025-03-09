/**
 * מודול זיהוי חוסרים בתכניות
 * 
 * מודול זה אחראי על זיהוי חוסרים ובעיות בתכניות, התרעה על מידע חסר
 * שעלול לעכב את תהליך הבנייה או להוביל לטעויות בתמחור.
 */

/**
 * פונקציה לזיהוי חוסרים ובעיות בתכנית
 * @param {Object} elements האלמנטים שזוהו בתכנית
 * @param {Object} blueprintData נתוני התכנית
 * @returns {Array} רשימת אזהרות והתראות על חוסרים
 */
function detectMissingInfo(elements, blueprintData) {
  try {
    const warnings = [];
    
    // בדיקת שלמות סט התכניות
    checkBlueprintCompleteness(blueprintData, warnings);
    
    // בדיקת חוסרים בתכנית חשמל
    checkElectricalPlan(blueprintData, warnings);
    
    // בדיקת חוסרים בתכנית אינסטלציה
    checkPlumbingPlan(blueprintData, warnings);
    
    // בדיקת מידות חסרות
    checkMissingDimensions(elements, blueprintData, warnings);
    
    // בדיקת סתירות בין תכניות
    checkPlanConsistency(blueprintData, warnings);
    
    // בדיקת פרטים מיוחדים חסרים
    checkMissingSpecialDetails(elements, blueprintData, warnings);
    
    return warnings;
  } catch (error) {
    console.error('שגיאה בזיהוי חוסרים בתכנית:', error);
    return [{ 
      severity: 'error', 
      message: `שגיאה בזיהוי חוסרים בתכנית: ${error.message}`,
      location: 'כללי'
    }];
  }
}

/**
 * בדיקת שלמות סט התכניות
 * @param {Object} blueprintData נתוני התכנית
 * @param {Array} warnings מערך האזהרות שיעודכן
 */
function checkBlueprintCompleteness(blueprintData, warnings) {
  // בדיקה אם קיימות כל התכניות הנדרשות
  const requiredPlans = [
    { type: 'אדריכלות', isMandatory: true },
    { type: 'קונסטרוקציה', isMandatory: true },
    { type: 'חשמל', isMandatory: true },
    { type: 'אינסטלציה', isMandatory: true },
    { type: 'מיזוג אוויר', isMandatory: false }
  ];
  
  // בדיקה מדומה - בפועל תתבצע בדיקה אמיתית לפי הקבצים שהועלו
  const availablePlans = blueprintData.availablePlans || [];
  
  for (const plan of requiredPlans) {
    const isPlanAvailable = availablePlans.includes(plan.type);
    
    if (!isPlanAvailable && plan.isMandatory) {
      warnings.push({
        severity: 'critical',
        message: `חסרה תכנית ${plan.type}`,
        location: 'סט תכניות',
        impact: 'לא ניתן להתחיל בניה ללא תכנית זו',
        recommendation: `יש לבקש תכנית ${plan.type} מהמתכנן`
      });
    } else if (!isPlanAvailable) {
      warnings.push({
        severity: 'warning',
        message: `חסרה תכנית ${plan.type}`,
        location: 'סט תכניות',
        impact: 'יתכנו עיכובים בהמשך התהליך',
        recommendation: `יש לבקש תכנית ${plan.type} מהמתכנן לפני שלב התכנון המפורט`
      });
    }
  }
}

/**
 * בדיקת חוסרים בתכנית חשמל
 * @param {Object} blueprintData נתוני התכנית
 * @param {Array} warnings מערך האזהרות שיעודכן
 */
function checkElectricalPlan(blueprintData, warnings) {
  // בדיקה מדומה - בפועל תתבצע בדיקה מעמיקה של תכנית החשמל
  const electricalPlan = blueprintData.plans && blueprintData.plans.electrical;
  
  if (!electricalPlan) {
    // אם אין בכלל תכנית חשמל, ההתראה תתווסף בפונקציה checkBlueprintCompleteness
    return;
  }
  
  // בדיקת קיום מידע על נקודות חשמל
  if (!electricalPlan.powerPoints) {
    warnings.push({
      severity: 'high',
      message: 'חסר סימון נקודות חשמל בתכנית',
      location: 'תכנית חשמל',
      impact: 'לא ניתן להזמין חשמלאי ללא מיקום מדויק של נקודות',
      recommendation: 'יש לבקש תכנית חשמל מפורטת עם סימון כל נקודות החשמל'
    });
  }
  
  // בדיקת קיום מידע על גבהים של נקודות חשמל
  if (!electricalPlan.heightSpecifications) {
    warnings.push({
      severity: 'high',
      message: 'חסר מידע על גבהי נקודות חשמל',
      location: 'תכנית חשמל',
      impact: 'חשמלאי לא יוכל לקבוע את הגבהים המדויקים של הנקודות',
      recommendation: 'יש לבקש מפרט גבהים מדויק לכל נקודות החשמל, במיוחד במטבח'
    });
  }
  
  // בדיקת קיום מידע על לוח חשמל
  if (!electricalPlan.mainPanel) {
    warnings.push({
      severity: 'high',
      message: 'חסר מיקום וגודל לוח חשמל',
      location: 'תכנית חשמל',
      impact: 'לא ניתן לתכנן את ההכנות ללוח החשמל',
      recommendation: 'יש לבקש מהמתכנן מיקום מדויק וגודל לוח החשמל'
    });
  }
  
  // בדיקת קיום מידע על הארקה
  if (!electricalPlan.grounding) {
    warnings.push({
      severity: 'medium',
      message: 'חסר מידע על מערכת הארקה',
      location: 'תכנית חשמל',
      impact: 'יתכנו בעיות בטיחות חשמל',
      recommendation: 'יש לבקש מהמתכנן פרטי מערכת הארקה'
    });
  }
}

/**
 * בדיקת חוסרים בתכנית אינסטלציה
 * @param {Object} blueprintData נתוני התכנית
 * @param {Array} warnings מערך האזהרות שיעודכן
 */
function checkPlumbingPlan(blueprintData, warnings) {
  // בדיקה מדומה - בפועל תתבצע בדיקה מעמיקה של תכנית האינסטלציה
  const plumbingPlan = blueprintData.plans && blueprintData.plans.plumbing;
  
  if (!plumbingPlan) {
    // אם אין בכלל תכנית אינסטלציה, ההתראה תתווסף בפונקציה checkBlueprintCompleteness
    return;
  }
  
  // בדיקת קיום מידע על נקודות מים
  if (!plumbingPlan.waterPoints) {
    warnings.push({
      severity: 'high',
      message: 'חסר סימון נקודות מים בתכנית',
      location: 'תכנית אינסטלציה',
      impact: 'לא ניתן להזמין שרברב ללא מיקום מדויק של נקודות',
      recommendation: 'יש לבקש תכנית אינסטלציה מפורטת עם סימון כל נקודות המים'
    });
  }
  
  // בדיקת קיום מידע על צנרת ביוב
  if (!plumbingPlan.sewage) {
    warnings.push({
      severity: 'high',
      message: 'חסר מידע על מערכת ביוב',
      location: 'תכנית אינסטלציה',
      impact: 'לא ניתן לתכנן חיבורי ביוב',
      recommendation: 'יש לבקש מהמתכנן תוואי צנרת ביוב ומיקום שוחות'
    });
  }
  
  // בדיקת קיום מידע על שיפועי רצפה בחדרים רטובים
  if (!plumbingPlan.floorSlopes) {
    warnings.push({
      severity: 'high',
      message: 'חסר מידע על שיפועי ניקוז בחדרים רטובים',
      location: 'תכנית אינסטלציה',
      impact: 'לא ניתן לבצע ריצוף נכון בחדרים רטובים',
      recommendation: 'יש לבקש מהמתכנן פרטי שיפועים ונקזים בחדרים רטובים'
    });
  }
  
  // בדיקת קיום מידע על קוטרי צנרת
  if (!plumbingPlan.pipeSizes) {
    warnings.push({
      severity: 'medium',
      message: 'חסר מידע על קוטרי צנרת',
      location: 'תכנית אינסטלציה',
      impact: 'לא ניתן להזמין חומרים מתאימים',
      recommendation: 'יש לבקש מהמתכנן פירוט קוטרי צנרת לכל המערכות'
    });
  }
}

/**
 * בדיקת מידות חסרות בתכנית
 * @param {Object} elements האלמנטים שזוהו בתכנית
 * @param {Object} blueprintData נתוני התכנית
 * @param {Array} warnings מערך האזהרות שיעודכן
 */
function checkMissingDimensions(elements, blueprintData, warnings) {
  // בדיקה מדומה - בפועל תתבצע בדיקה מעמיקה של כל המידות בתכנית
  
  // בדיקת קיום מידות כלליות של המבנה
  if (!blueprintData.width || !blueprintData.length) {
    warnings.push({
      severity: 'critical',
      message: 'חסרות מידות כלליות של המבנה',
      location: 'תכנית אדריכלית',
      impact: 'לא ניתן לחשב כמויות מדויקות',
      recommendation: 'יש לבקש מהאדריכל תכנית עם מידות מדויקות של המבנה'
    });
  }
  
  // בדיקת קיום מידות לחדרים
  if (!blueprintData.roomDimensions) {
    warnings.push({
      severity: 'high',
      message: 'חסרות מידות מדויקות לחדרים',
      location: 'תכנית אדריכלית',
      impact: 'לא ניתן לחשב כמויות ריצוף וגבס באופן מדויק',
      recommendation: 'יש לבקש מהאדריכל תכנית עם מידות לכל החדרים'
    });
  }
  
  // בדיקת קיום מידות לפתחים (חלונות ודלתות)
  if (!blueprintData.openingDimensions) {
    warnings.push({
      severity: 'high',
      message: 'חסרות מידות לפתחים (חלונות ודלתות)',
      location: 'תכנית אדריכלית',
      impact: 'לא ניתן להזמין דלתות וחלונות',
      recommendation: 'יש לבקש מהאדריכל מידות מדויקות לכל הפתחים'
    });
  }
  
  // בדיקת קיום מידות גובה
  if (!blueprintData.height) {
    warnings.push({
      severity: 'high',
      message: 'חסרות מידות גובה',
      location: 'תכנית אדריכלית',
      impact: 'לא ניתן לחשב כמויות גבס לקירות',
      recommendation: 'יש לבקש מהאדריכל מידות גובה לכל החללים'
    });
  }
  
  // בדיקת קיום מידות למדרגות
  if (elements.stairs && elements.stairs.count > 0 && !blueprintData.stairDimensions) {
    warnings.push({
      severity: 'high',
      message: 'חסרות מידות מדויקות למדרגות',
      location: 'תכנית אדריכלית',
      impact: 'לא ניתן להזמין או לייצר מדרגות',
      recommendation: 'יש לבקש מהאדריכל פרט מדרגות עם מידות מלאות'
    });
  }
}

/**
 * בדיקת סתירות בין תכניות שונות
 * @param {Object} blueprintData נתוני התכנית
 * @param {Array} warnings מערך האזהרות שיעודכן
 */
function checkPlanConsistency(blueprintData, warnings) {
  // בדיקה מדומה - בפועל תתבצע השוואה בין כל התכניות
  
  // בדיקת התאמה בין תכנית אדריכלית לתכנית קונסטרוקציה
  const architecturalPlan = blueprintData.plans && blueprintData.plans.architectural;
  const structuralPlan = blueprintData.plans && blueprintData.plans.structural;
  
  if (architecturalPlan && structuralPlan) {
    // בדיקה מדומה של סתירות בין התכניות
    if (Math.random() > 0.7) { // סתירה מדומה בסבירות של 30%
      warnings.push({
        severity: 'critical',
        message: 'סתירה בין תכנית אדריכלית לתכנית קונסטרוקציה',
        location: 'סט תכניות',
        impact: 'לא ניתן להתקדם עם הבנייה עד לפתרון הסתירה',
        recommendation: 'יש לבקש מהאדריכל והמהנדס לתאם בין התכניות'
      });
    }
  }
  
  // בדיקת התאמה בין תכנית אדריכלית לתכנית חשמל
  const electricalPlan = blueprintData.plans && blueprintData.plans.electrical;
  
  if (architecturalPlan && electricalPlan) {
    // בדיקה מדומה של סתירות בין התכניות
    if (Math.random() > 0.8) { // סתירה מדומה בסבירות של 20%
      warnings.push({
        severity: 'high',
        message: 'סתירה בין תכנית אדריכלית לתכנית חשמל',
        location: 'סט תכניות',
        impact: 'ייתכנו בעיות במיקום נקודות חשמל',
        recommendation: 'יש לבקש מהאדריכל ויועץ החשמל לתאם בין התכניות'
      });
    }
  }
  
  // בדיקת התאמה בין תכנית אדריכלית לתכנית אינסטלציה
  const plumbingPlan = blueprintData.plans && blueprintData.plans.plumbing;
  
  if (architecturalPlan && plumbingPlan) {
    // בדיקה מדומה של סתירות בין התכניות
    if (Math.random() > 0.8) { // סתירה מדומה בסבירות של 20%
      warnings.push({
        severity: 'high',
        message: 'סתירה בין תכנית אדריכלית לתכנית אינסטלציה',
        location: 'סט תכניות',
        impact: 'ייתכנו בעיות במיקום כלים סניטריים ונקודות מים',
        recommendation: 'יש לבקש מהאדריכל ויועץ האינסטלציה לתאם בין התכניות'
      });
    }
  }
}

/**
 * בדיקת פרטים מיוחדים חסרים
 * @param {Object} elements האלמנטים שזוהו בתכנית
 * @param {Object} blueprintData נתוני התכנית
 * @param {Array} warnings מערך האזהרות שיעודכן
 */
function checkMissingSpecialDetails(elements, blueprintData, warnings) {
  // בדיקת פרטי ממ"ד
  if (elements.specialRooms && elements.specialRooms.shelter.count > 0) {
    // בדיקת קיום פרטי חלון ודלת ממ"ד
    if (!blueprintData.shelterDetails) {
      warnings.push({
        severity: 'critical',
        message: 'חסרים פרטי ממ"ד',
        location: 'תכנית אדריכלית',
        impact: 'לא ניתן להזמין חלון וארון למערכות סינון ולא ניתן לבנות ממ"ד תקני',
        recommendation: 'יש לבקש פרט ממ"ד מלא עם מידות לכל האלמנטים'
      });
    }
  }
  
  // בדיקת פרטי מטבח
  if (elements.specialRooms && elements.specialRooms.kitchen.count > 0) {
    // בדיקת קיום פריסות מטבח
    if (!blueprintData.kitchenDetails) {
      warnings.push({
        severity: 'high',
        message: 'חסרות פריסות מטבח',
        location: 'תכנית אדריכלית',
        impact: 'לא ניתן לתכנן נקודות חשמל ואינסטלציה במטבח',
        recommendation: 'יש לבקש מהאדריכל פריסות מטבח מלאות עם מיקום נקודות'
      });
    }
  }
  
  // בדיקת פרטי חדרים רטובים
  if (elements.specialRooms && elements.specialRooms.bathroom.count > 0) {
    // בדיקת קיום פריסות חדרים רטובים
    if (!blueprintData.bathroomDetails) {
      warnings.push({
        severity: 'high',
        message: 'חסרות פריסות חדרים רטובים',
        location: 'תכנית אדריכלית',
        impact: 'לא ניתן לתכנן חיפוי ונקודות חשמל ואינסטלציה בחדרים רטובים',
        recommendation: 'יש לבקש מהאדריכל פריסות מלאות לכל החדרים הרטובים'
      });
    }
  }
  
  // בדיקת פרטי גג
  if (elements.roofs && elements.roofs.totalArea > 0) {
    // בדיקת קיום פרטי גג
    if (!blueprintData.roofDetails) {
      warnings.push({
        severity: 'high',
        message: 'חסרים פרטי גג',
        location: 'תכנית אדריכלית',
        impact: 'לא ניתן לתכנן איטום ובניית גג באופן תקין',
        recommendation: 'יש לבקש מהאדריכל פרטי גג מלאים'
      });
    }
  }
  
  // בדיקת פרטי מדרגות
  if (elements.stairs && elements.stairs.count > 0) {
    // בדיקת קיום פרטי מדרגות
    if (!blueprintData.stairDetails) {
      warnings.push({
        severity: 'high',
        message: 'חסרים פרטי מדרגות',
        location: 'תכנית אדריכלית',
        impact: 'לא ניתן לבנות מדרגות ללא פרטים מלאים',
        recommendation: 'יש לבקש מהאדריכל פרטי מדרגות מלאים'
      });
    }
  }
}

module.exports = {
  detectMissingInfo
};
