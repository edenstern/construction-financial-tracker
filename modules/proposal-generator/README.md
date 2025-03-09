# מודול הפקת הצעות מחיר

מודול זה אחראי על הפקת הצעות מחיר מקצועיות ומעוצבות על בסיס נתוני התמחור.

## יכולות

- יצירת מסמכי הצעת מחיר ב-PDF בעיצוב מינימליסטי מקצועי
- שילוב לוגו וסגנון התאגיד
- מבנה מודולרי עם אפשרות התאמה אישית
- פירוט מפרט טכני מלא
- תנאי תשלום ולוח זמנים
- ניהול גרסאות ומעקב אחר שינויים

## שימוש

```javascript
const { generateProposal } = require('proposal-generator');

// יצירת הצעת מחיר
const proposal = await generateProposal({
  client: clientData,
  project: projectData,
  costs: costData,
  specifications: technicalSpecs,
  template: 'premium',  // תבנית העיצוב
  language: 'he'        // שפה
});

// שמירת ההצעה לקובץ
await proposal.saveToFile('proposal.pdf');

// שליחת ההצעה במייל
await proposal.sendByEmail('client@example.com');
```

## תבניות

המודול כולל מספר תבניות מובנות:
- בסיסית - עיצוב נקי ופונקציונלי
- פרימיום - עיצוב מינימליסטי אירופאי ברמה גבוהה
- מפורטת - גרסה מורחבת עם פירוט מלא של כל סעיף

ניתן להתאים אישית את התבניות או ליצור תבניות חדשות.
