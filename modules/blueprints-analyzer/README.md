# מודול ניתוח תכניות

מודול זה אחראי על ניתוח תכניות אדריכליות וקונסטרוקציה, וחישוב כמויות חומרים.

## יכולות

- קליטת קבצי DWG, PDF, ופורמטים אדריכליים נוספים
- זיהוי אוטומטי של קירות (פנים, חוץ, חדרים רטובים)
- חישוב שטחים (רצפה, קירות, גגות, חללים רטובים)
- מדידת אורכים (קירות, ספי חלון, מדרגות)
- זיהוי חללים מיוחדים (ממ"ד, מרפסות, מרתף)
- חישוב כמויות חומרים (גבס, בטון, ריצוף)
- התראות על חוסרים בתכניות

## שימוש

```javascript
const { analyzeBlueprint } = require('blueprints-analyzer');

// ניתוח תכנית
const result = await analyzeBlueprint('path/to/blueprint.pdf');

// תוצאת הניתוח
console.log(result.areas);        // שטחים
console.log(result.lengths);       // אורכים
console.log(result.materials);     // כמויות חומרים
console.log(result.warnings);      // התראות והערות
```

## מודלים ואלגוריתמים

- זיהוי אוטומטי של קירות באמצעות עיבוד תמונה
- חישוב שטחים מדויק עם התחשבות בפתחים
- זיהוי סוגי חומרים לפי סימון בתכניות
- אימות נתונים והתראות על חריגות
