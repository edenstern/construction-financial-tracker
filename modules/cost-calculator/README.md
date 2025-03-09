# מודול תמחור

מודול זה אחראי על תמחור הפרויקט בהתבסס על כמויות חומרים וסוגי עבודה.

## יכולות

- תמחור אוטומטי של חומרים לפי כמויות
- תמחור עבודה לפי סוגים ומורכבות
- תמחור לפי יחידות (חדרים רטובים, ממ"ד) או לפי מ"ר/מטר אורך
- מחירון דינמי מתעדכן
- השוואה למחירי שוק ופרויקטים קודמים
- אפשרות להתאמה ידנית ומקדמי בטחון

## שימוש

```javascript
const { calculateCosts } = require('cost-calculator');

// חישוב עלויות
const costs = calculateCosts({
  materials: quantities.materials,
  areas: quantities.areas,
  lengths: quantities.lengths,
  specials: quantities.specials,
  complexityFactor: 1.2,  // מקדם מורכבות
});

// תוצאות התמחור
console.log(costs.materials);    // עלויות חומרים
console.log(costs.labor);        // עלויות עבודה
console.log(costs.total);        // סה"כ עלות
console.log(costs.breakdown);    // פירוט לפי קטגוריות
```

## מחירון

המחירון מבוסס על מסד נתונים מתעדכן הכולל:
- מחירי חומרי גלם
- מחירי עבודה לפי סוג ומורכבות
- מחירי קבלני משנה
- מחירי יחידות סטנדרטיות (חדרים רטובים, ממ"ד)

המחירון מתעדכן באופן תקופתי ומתבסס על נתוני שוק עדכניים.
