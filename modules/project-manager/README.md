# מודול ניהול פרויקטים

מודול זה אחראי על ניהול פרויקטים, מעקב אחר התקדמות, וניהול צ'ק-ליסטים.

## יכולות

- ניהול צ'ק-ליסטים מותאמים אישית לכל פרויקט
- מעקב אחר התקדמות פרויקט בזמן אמת
- תזכורות והתראות חכמות לפעולות הבאות
- ניהול ספקים וקבלני משנה
- תיאום בין גורמים שונים בפרויקט
- הפקת דוחות התקדמות

## שימוש

```javascript
const { ProjectManager } = require('project-manager');

// יצירת מופע לניהול פרויקט
const manager = new ProjectManager(projectId);

// טעינת צ'ק-ליסט
await manager.loadChecklist('standard-building');

// קבלת משימות לשבוע הקרוב
const upcomingTasks = await manager.getUpcomingTasks(7);  // 7 ימים קדימה

// עדכון סטטוס משימה
await manager.updateTaskStatus(taskId, 'completed');

// קבלת התראות
const alerts = await manager.getAlerts();
```

## צ'ק-ליסטים

המודול כולל מספר צ'ק-ליסטים מובנים:
- בנייה סטנדרטית
- שיפוץ כללי
- מבנה מייטק
- בנייה מתקדמת עם גבס

ניתן להתאים אישית את הצ'ק-ליסטים או ליצור חדשים בהתאם לצרכים.
