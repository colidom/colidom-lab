/**
 * Utilidades para cálculos de tiempo en jornadas laborales
 */

/**
 * Calcula la hora de salida basándose en hora de entrada, tipo de jornada y descansos
 */
export const calculateEndTime = (startTime, workDayType, customHours, breaks) => {
    if (!startTime) return "";

    const targetHours = workDayType === "normal" ? 8.5 : 
                      workDayType === "friday" ? 6 : 
                      workDayType === "summer" ? 7 : 
                      customHours;
    
    // Solo contar descansos que NO son tiempo efectivo
    const totalBreakMinutes = breaks.reduce((sum, b) => {
        return sum + (b.isEffectiveTime ? 0 : (b.duration || 0));
    }, 0);
    
    const [hours, minutes] = startTime.split(":").map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);

    const totalMinutes = (targetHours * 60) + totalBreakMinutes;
    const endDate = new Date(startDate.getTime() + totalMinutes * 60000);

    const endHours = String(endDate.getHours()).padStart(2, "0");
    const endMinutes = String(endDate.getMinutes()).padStart(2, "0");
    return `${endHours}:${endMinutes}`;
};

/**
 * Calcula el tiempo trabajado hasta el momento actual
 */
export const calculateTimeWorked = (startTime, currentTime, breaks) => {
    if (!startTime) return { hours: 0, minutes: 0, totalMinutes: 0 };
    
    const [startH, startM] = startTime.split(":").map(Number);
    const [nowH, nowM] = [currentTime.getHours(), currentTime.getMinutes()];

    const startMinutes = startH * 60 + startM;
    const nowMinutes = nowH * 60 + nowM;

    let workedMinutes = nowMinutes - startMinutes;
    if (workedMinutes < 0) {
        workedMinutes += 24 * 60;
    }

    // Solo descontar descansos que NO son tiempo efectivo
    const totalBreakMinutes = breaks.reduce((sum, b) => {
        return sum + (b.isEffectiveTime ? 0 : (b.duration || 0));
    }, 0);
    const effectiveWorkedMinutes = Math.max(0, workedMinutes - totalBreakMinutes);

    const hours = Math.floor(effectiveWorkedMinutes / 60);
    const minutes = effectiveWorkedMinutes % 60;
    
    return { hours, minutes, totalMinutes: effectiveWorkedMinutes };
};

/**
 * Calcula el tiempo restante hasta el final de la jornada
 */
export const calculateTimeRemaining = (endTime, currentTime, startTime) => {
    if (!startTime || !endTime) return { hours: 0, minutes: 0, isOvertime: false };
    
    const [endH, endM] = endTime.split(":").map(Number);
    const [nowH, nowM] = [currentTime.getHours(), currentTime.getMinutes()];
    const [startH, startM] = startTime.split(":").map(Number);

    let endMinutes = endH * 60 + endM;
    const nowMinutes = nowH * 60 + nowM;
    const startMinutes = startH * 60 + startM;

    // Si la hora de fin es menor que la hora de inicio, cruzamos medianoche
    if (endMinutes < startMinutes) {
        endMinutes += 1440;
    }

    // Si estamos antes de la hora de inicio, estamos en el día siguiente
    let adjustedNowMinutes = nowMinutes;
    if (nowMinutes < startMinutes && endMinutes > 1440) {
        adjustedNowMinutes += 1440;
    }

    let remaining = endMinutes - adjustedNowMinutes;
    
    if (remaining < 0) {
        const overtime = Math.abs(remaining);
        return {
            hours: Math.floor(overtime / 60),
            minutes: overtime % 60,
            isOvertime: true
        };
    }
    
    return {
        hours: Math.floor(remaining / 60),
        minutes: remaining % 60,
        isOvertime: false
    };
};

/**
 * Calcula el porcentaje de progreso de la jornada
 */
export const calculateProgressPercentage = (startTime, endTime, currentTime) => {
    if (!startTime || !endTime) return 0;

    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    const [nowH, nowM] = [currentTime.getHours(), currentTime.getMinutes()];

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    const nowMinutes = nowH * 60 + nowM;

    const totalWorkMinutes = endMinutes - startMinutes;
    const elapsedMinutes = nowMinutes - startMinutes;

    const percentage = Math.min(100, Math.max(0, (elapsedMinutes / totalWorkMinutes) * 100));
    return percentage;
};

/**
 * Calcula las horas objetivo según el tipo de jornada
 */
export const getTargetHours = (workDayType, customHours) => {
    return workDayType === "normal" ? 8.5 : 
           workDayType === "friday" ? 6 : 
           workDayType === "summer" ? 7 : 
           customHours;
};

/**
 * Calcula el inicio de la semana (lunes)
 */
export const getStartOfWeek = (date = new Date()) => {
    const startOfWeek = new Date(date);
    const dayOfWeek = date.getDay();
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeek.setDate(date.getDate() + daysToMonday);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
};

/**
 * Formatea minutos a formato legible (Xh Ym)
 */
export const formatMinutesToTime = (minutes) => {
    const hours = Math.floor(Math.abs(minutes) / 60);
    const mins = Math.abs(minutes) % 60;
    const sign = minutes < 0 ? '-' : '';
    
    if (hours === 0) {
        return `${sign}${mins}min`;
    }
    return `${sign}${hours}h ${mins}min`;
};

/**
 * Separa los descansos en efectivos y no efectivos
 */
export const separateBreaks = (breaks) => {
    const totalBreakTime = breaks.reduce((sum, b) => sum + (b.duration || 0), 0);
    const effectiveBreakTime = breaks.reduce((sum, b) => sum + (b.isEffectiveTime ? (b.duration || 0) : 0), 0);
    const nonEffectiveBreakTime = totalBreakTime - effectiveBreakTime;
    
    return {
        totalBreakTime,
        effectiveBreakTime,
        nonEffectiveBreakTime
    };
};
