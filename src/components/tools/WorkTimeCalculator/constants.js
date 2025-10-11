/**
 * Constantes para WorkTimeCalculator
 */

export const WORK_DAY_TYPES = [
    { id: "normal", name: "Lunes - Jueves", hours: 8.5, icon: "📅", desc: "Jornada estándar" },
    { id: "friday", name: "Viernes", hours: 6, icon: "🎉", desc: "Jornada reducida" },
    { id: "summer", name: "Verano", hours: 7, icon: "☀️", desc: "Jornada intensiva" },
    { id: "custom", name: "Personalizado", hours: "custom", icon: "⚙️", desc: "Horas personalizadas" },
];

export const QUICK_BREAKS = [
    { duration: 15, name: "Café", icon: "☕", label: "15 min" },
    { duration: 30, name: "Almuerzo", icon: "🍔", label: "30 min" },
    { duration: 60, name: "Comida", icon: "🍽️", label: "1 hora" },
];

export const STORAGE_KEYS = {
    WORKDAYS: 'workdays',
    LAST_BACKUP: 'lastBackupDate',
    WORK_SESSION: 'workSession',
    NOTIFICATIONS: 'workTimerNotifications'
};

export const RETENTION_DAYS = 90; // Días que se mantienen las jornadas guardadas

export const NOTIFICATION_MESSAGES = {
    WORKDAY_DELETED: '✅ Jornada eliminada',
    WORKDAY_UPDATED: '✅ Jornada actualizada',
    WORKDAY_END: '⏰ ¡Hora de Salir!',
    WORKDAY_END_MESSAGE: 'Tu jornada laboral ha terminado.',
};
