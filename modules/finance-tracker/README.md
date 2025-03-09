# מודול ניהול פיננסי

מודול זה אחראי על ניהול תזרים המזומנים, הוצאות והכנסות ברמת הפרויקט והחברה כולה.

## יכולות

- מעקב אחר הוצאות והכנסות בזמן אמת
- תחזית תזרים מזומנים
- מעקב אחר תשלומים מלקוחות ולספקים
- השוואה בין תמחור לביצוע בפועל
- ניתוח רווחיות פרויקטים
- דוחות פיננסיים

## שימוש

```javascript
const { FinanceTracker } = require('finance-tracker');

// יצירת מופע למעקב פיננסי
const tracker = new FinanceTracker(companyId);

// רישום הוצאה
await tracker.recordExpense({
  projectId: 'project-123',
  category: 'materials',
  amount: 5000,
  supplier: 'supplier-456',
  description: 'רכישת גבס',
  date: new Date()
});

// רישום הכנסה (תשלום מלקוח)
await tracker.recordIncome({
  projectId: 'project-123',
  amount: 50000,
  client: 'client-789',
  description: 'תשלום ראשון',
  date: new Date()
});

// קבלת תחזית תזרים מזומנים
const cashFlow = await tracker.getCashFlowForecast(90);  // 90 ימים קדימה

// הפקת דוח רווחיות פרויקט
const profitReport = await tracker.getProjectProfitability('project-123');
```

## דוחות

המודול מספק מגוון דוחות פיננסיים:
- תזרים מזומנים
- רווח והפסד
- השוואת תקציב מול ביצוע
- רווחיות פרויקטים
- תשלומים צפויים וחייבים
