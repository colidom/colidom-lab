import { useState, useEffect } from "react";
import { calculateEndTime, getTargetHours, getStartOfWeek } from "../utils/timeCalculations";
import { STORAGE_KEYS, RETENTION_DAYS } from "../constants";

export function useWorkTimeCalculator() {
    // Estados principales
    const [workDayType, setWorkDayType] = useState("normal");
    const [customHours, setCustomHours] = useState(8.5);
    const [startTime, setStartTime] = useState("");
    const [breaks, setBreaks] = useState([]);
    const [endTime, setEndTime] = useState("");
    const [isLiveMode, setIsLiveMode] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeView, setActiveView] = useState('calculator');
    
    // Estados para modales
    const [showCustomBreakModal, setShowCustomBreakModal] = useState(false);
    const [customBreakName, setCustomBreakName] = useState("");
    const [customBreakDuration, setCustomBreakDuration] = useState(30);
    const [customBreakIsEffective, setCustomBreakIsEffective] = useState(false);
    
    // Estados para edición de jornadas
    const [editingWorkday, setEditingWorkday] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editFormData, setEditFormData] = useState({
        date: '',
        startTime: '',
        actualEndTime: '',
        workDayType: 'normal',
        customHours: 8.5,
        breaks: []
    });
    
    // Estados para historial
    const [historyKey, setHistoryKey] = useState(0);
    const [weekWorkdays, setWeekWorkdays] = useState([]);
    
    // Estado para backup
    const [lastBackup, setLastBackup] = useState(() => {
        const last = localStorage.getItem(STORAGE_KEYS.LAST_BACKUP);
        return last ? new Date(last) : null;
    });
    
    // Estado para modal de confirmación
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: null
    });

    // Funciones de confirmación
    const showConfirm = (title, message, onConfirm) => {
        setConfirmModal({ isOpen: true, title, message, onConfirm });
    };

    const closeConfirm = () => {
        setConfirmModal({ isOpen: false, title: "", message: "", onConfirm: null });
    };

    // Cargar sesión existente al montar
    useEffect(() => {
        const savedSession = sessionStorage.getItem(STORAGE_KEYS.WORK_SESSION);
        if (savedSession) {
            const session = JSON.parse(savedSession);
            if (session.isActive) {
                setStartTime(session.startTime);
                setEndTime(session.endTime);
                setWorkDayType(session.workDayType);
                setCustomHours(session.customHours || 8.5);
                setBreaks(session.breaks || []);
                setIsLiveMode(true);
            }
        }
    }, []);

    // Escuchar evento de reset completo desde el widget
    useEffect(() => {
        const handleReset = () => {
            sessionStorage.clear();
            setStartTime("");
            setEndTime("");
            setWorkDayType("normal");
            setCustomHours(8.5);
            setBreaks([]);
            setIsLiveMode(false);
        };

        window.addEventListener('workSessionReset', handleReset);
        return () => window.removeEventListener('workSessionReset', handleReset);
    }, []);

    // Escuchar cambios en la sesión de trabajo
    useEffect(() => {
        const handleSessionUpdate = () => {
            const savedSession = sessionStorage.getItem(STORAGE_KEYS.WORK_SESSION);
            if (!savedSession && isLiveMode) {
                setIsLiveMode(false);
            }
        };

        window.addEventListener('workSessionUpdate', handleSessionUpdate);
        return () => window.removeEventListener('workSessionUpdate', handleSessionUpdate);
    }, [isLiveMode]);

    // Guardar en sessionStorage cuando cambia el estado
    useEffect(() => {
        if (isLiveMode && startTime && endTime) {
            const totalBreakMinutes = breaks.reduce((sum, b) => sum + (b.duration || 0), 0);
            const targetHours = getTargetHours(workDayType, customHours);
            
            const workSession = {
                isActive: true,
                startTime,
                endTime,
                workDayType,
                customHours,
                breaks,
                totalBreakMinutes,
                targetHours
            };
            
            sessionStorage.setItem(STORAGE_KEYS.WORK_SESSION, JSON.stringify(workSession));
            window.dispatchEvent(new Event('workSessionUpdate'));
        } else if (!isLiveMode) {
            sessionStorage.removeItem(STORAGE_KEYS.WORK_SESSION);
            window.dispatchEvent(new Event('workSessionUpdate'));
        }
    }, [isLiveMode, startTime, endTime, breaks, workDayType, customHours]);

    // Actualizar tiempo actual cada segundo en modo live
    useEffect(() => {
        if (isLiveMode) {
            const interval = setInterval(() => setCurrentTime(new Date()), 1000);
            return () => clearInterval(interval);
        }
    }, [isLiveMode]);

    // Calcular hora de salida
    useEffect(() => {
        const newEndTime = calculateEndTime(startTime, workDayType, customHours, breaks);
        setEndTime(newEndTime);
    }, [startTime, breaks, workDayType, customHours]);

    // Re-calcular jornadas de la semana
    useEffect(() => {
        if (activeView === 'history') {
            const workdays = JSON.parse(localStorage.getItem(STORAGE_KEYS.WORKDAYS) || '[]');
            const startOfWeek = getStartOfWeek();
            
            const filtered = workdays.filter(w => {
                const workdayDate = new Date(w.timestamp);
                return workdayDate >= startOfWeek;
            });
            
            filtered.sort((a, b) => b.timestamp - a.timestamp);
            setWeekWorkdays(filtered);
        }
    }, [activeView, historyKey]);

    // Funciones de manejo de cambios con confirmación
    const handleWorkDayTypeChange = (newType) => {
        if (isLiveMode && newType !== workDayType) {
            showConfirm(
                "¿Cambiar tipo de jornada?",
                "Esto recalculará tu hora de salida y puede afectar tu seguimiento actual.",
                () => setWorkDayType(newType)
            );
        } else {
            setWorkDayType(newType);
        }
    };

    const handleStartTimeChange = (newTime) => {
        if (isLiveMode && newTime !== startTime) {
            showConfirm(
                "¿Cambiar hora de entrada?",
                "Esto recalculará toda tu jornada y puede afectar tu seguimiento actual.",
                () => setStartTime(newTime)
            );
        } else {
            setStartTime(newTime);
        }
    };

    const handleCustomHoursChange = (newHours) => {
        if (isLiveMode && newHours !== customHours) {
            showConfirm(
                "¿Cambiar horas de trabajo?",
                "Esto recalculará tu hora de salida y puede afectar tu seguimiento actual.",
                () => setCustomHours(newHours)
            );
        } else {
            setCustomHours(newHours);
        }
    };

    // Funciones de manejo de descansos
    const addBreak = (duration, name = "", isEffectiveTime = false) => {
        setBreaks([...breaks, { duration, name, isEffectiveTime }]);
    };

    const removeBreak = (index) => {
        setBreaks(breaks.filter((_, i) => i !== index));
    };

    const updateBreak = (index, field, value) => {
        const newBreaks = [...breaks];
        if (field === 'duration') {
            newBreaks[index].duration = parseInt(value) || 0;
        } else if (field === 'isEffectiveTime') {
            newBreaks[index].isEffectiveTime = value;
        }
        setBreaks(newBreaks);
    };

    const addCustomBreak = () => {
        if (customBreakDuration > 0) {
            addBreak(customBreakDuration, customBreakName || "Descanso", customBreakIsEffective);
            setShowCustomBreakModal(false);
            setCustomBreakName("");
            setCustomBreakDuration(30);
            setCustomBreakIsEffective(false);
        }
    };

    // Funciones de seguimiento
    const startLiveTracking = () => {
        if (!startTime) {
            alert("Por favor, introduce primero tu hora de entrada");
            return;
        }
        
        sessionStorage.clear();
        
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
        
        setIsLiveMode(true);
        setCurrentTime(new Date());
    };

    const stopLiveTracking = () => {
        showConfirm(
            "¿Detener seguimiento?",
            "Se guardará tu jornada actual y se detendrá el seguimiento.",
            () => {
                saveCompletedWorkday();
                setIsLiveMode(false);
                sessionStorage.removeItem(STORAGE_KEYS.WORK_SESSION);
                sessionStorage.clear();
                window.dispatchEvent(new Event('workSessionUpdate'));
            }
        );
    };

    const setCurrentTimeAsStart = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const newTime = `${hours}:${minutes}`;
        
        if (isLiveMode) {
            showConfirm(
                "¿Usar hora actual?",
                "Esto recalculará toda tu jornada y puede afectar tu seguimiento actual.",
                () => setStartTime(newTime)
            );
        } else {
            setStartTime(newTime);
        }
    };

    // Guardar jornada completada
    const saveCompletedWorkday = () => {
        if (!startTime || !endTime || !isLiveMode) return;

        const now = new Date();
        const [startH, startM] = startTime.split(":").map(Number);
        const [endH, endM] = endTime.split(":").map(Number);
        
        const startMinutes = startH * 60 + startM;
        let endMinutes = endH * 60 + endM;
        let currentMinutes = now.getHours() * 60 + now.getMinutes();
        
        if (endMinutes < startMinutes) endMinutes += 1440;
        if (currentMinutes < startMinutes && endMinutes > 1440) currentMinutes += 1440;
        
        const totalMinutes = currentMinutes - startMinutes;
        const breakMinutes = breaks.reduce((sum, b) => {
            return sum + (b.isEffectiveTime ? 0 : (b.duration || 0));
        }, 0);
        const effectiveMinutes = totalMinutes - breakMinutes;
        
        const targetHours = getTargetHours(workDayType, customHours);
        const targetMinutes = targetHours * 60;
        const overtimeMinutes = effectiveMinutes - targetMinutes;
        
        const workday = {
            date: now.toISOString().split('T')[0],
            timestamp: now.getTime(),
            startTime,
            endTime,
            actualEndTime: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
            totalMinutes,
            breakMinutes,
            effectiveMinutes,
            overtimeMinutes,
            workDayType,
            targetHours,
            breaks: [...breaks]
        };
        
        const savedWorkdays = JSON.parse(localStorage.getItem(STORAGE_KEYS.WORKDAYS) || '[]');
        savedWorkdays.push(workday);
        
        const retentionDate = Date.now() - (RETENTION_DAYS * 24 * 60 * 60 * 1000);
        const filteredWorkdays = savedWorkdays.filter(w => w.timestamp > retentionDate);
        
        localStorage.setItem(STORAGE_KEYS.WORKDAYS, JSON.stringify(filteredWorkdays));
    };

    // Exportar/Importar datos
    const exportData = () => {
        const workdays = localStorage.getItem(STORAGE_KEYS.WORKDAYS) || '[]';
        const data = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            totalWorkdays: JSON.parse(workdays).length,
            workdays: JSON.parse(workdays)
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-jornadas-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        const now = new Date();
        localStorage.setItem(STORAGE_KEYS.LAST_BACKUP, now.toISOString());
        setLastBackup(now);
    };

    const importData = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (!data.workdays || !Array.isArray(data.workdays)) {
                    alert('❌ Archivo inválido: formato incorrecto');
                    return;
                }
                
                exportData(); // Backup antes de importar
                
                const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.WORKDAYS) || '[]');
                const merged = [...existing, ...data.workdays];
                
                const unique = merged.reduce((acc, curr) => {
                    const exists = acc.find(w => 
                        w.date === curr.date && 
                        w.startTime === curr.startTime
                    );
                    if (!exists) acc.push(curr);
                    return acc;
                }, []);
                
                unique.sort((a, b) => new Date(b.date) - new Date(a.date));
                
                localStorage.setItem(STORAGE_KEYS.WORKDAYS, JSON.stringify(unique));
                alert(`✅ Datos importados exitosamente\n\n📊 Jornadas nuevas: ${data.workdays.length}\n📈 Total en sistema: ${unique.length}`);
                
                if (activeView === 'history') {
                    window.location.reload();
                }
            } catch (error) {
                alert('❌ Error al importar: ' + error.message);
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    // Funciones de edición de jornadas
    const openEditModal = (workday) => {
        setEditingWorkday(workday);
        setEditFormData({
            date: workday.date,
            startTime: workday.startTime,
            actualEndTime: workday.actualEndTime,
            workDayType: workday.workDayType,
            customHours: workday.customHours || 8.5,
            breaks: [...(workday.breaks || [])]
        });
        setShowEditModal(true);
    };

    const saveEditedWorkday = () => {
        if (!editingWorkday) return;
        
        const [startH, startM] = editFormData.startTime.split(":").map(Number);
        const [endH, endM] = editFormData.actualEndTime.split(":").map(Number);
        
        const startMinutes = startH * 60 + startM;
        let endMinutes = endH * 60 + endM;
        
        if (endMinutes < startMinutes) endMinutes += 1440;
        
        const totalMinutes = endMinutes - startMinutes;
        const breakMinutes = editFormData.breaks.reduce((sum, b) => {
            return sum + (b.isEffectiveTime ? 0 : (b.duration || 0));
        }, 0);
        const effectiveMinutes = totalMinutes - breakMinutes;
        
        const targetHours = getTargetHours(editFormData.workDayType, editFormData.customHours);
        const targetMinutes = targetHours * 60;
        const overtimeMinutes = effectiveMinutes - targetMinutes;
        
        const totalBreakMinutes = editFormData.breaks.reduce((sum, b) => {
            return sum + (b.isEffectiveTime ? 0 : (b.duration || 0));
        }, 0);
        const expectedEndMinutes = startMinutes + (targetHours * 60) + totalBreakMinutes;
        const expectedEndHours = Math.floor(expectedEndMinutes / 60) % 24;
        const expectedEndMins = expectedEndMinutes % 60;
        const endTime = `${String(expectedEndHours).padStart(2, '0')}:${String(expectedEndMins).padStart(2, '0')}`;
        
        const [year, month, day] = editFormData.date.split('-').map(Number);
        const [actEndH, actEndM] = editFormData.actualEndTime.split(':').map(Number);
        const newTimestamp = new Date(year, month - 1, day, actEndH, actEndM).getTime();
        
        const updatedWorkday = {
            ...editingWorkday,
            date: editFormData.date,
            timestamp: newTimestamp,
            startTime: editFormData.startTime,
            actualEndTime: editFormData.actualEndTime,
            endTime,
            workDayType: editFormData.workDayType,
            customHours: editFormData.customHours,
            targetHours,
            breaks: [...editFormData.breaks],
            totalMinutes,
            breakMinutes,
            effectiveMinutes,
            overtimeMinutes
        };
        
        const workdays = JSON.parse(localStorage.getItem(STORAGE_KEYS.WORKDAYS) || '[]');
        const updated = workdays.map(w => 
            w.timestamp === editingWorkday.timestamp ? updatedWorkday : w
        );
        localStorage.setItem(STORAGE_KEYS.WORKDAYS, JSON.stringify(updated));
        
        setShowEditModal(false);
        setEditingWorkday(null);
        setHistoryKey(prev => prev + 1);
        
        showNotification('✅ Jornada actualizada');
    };

    const deleteWorkday = (timestamp) => {
        showConfirm(
            "¿Eliminar esta jornada?",
            "Esta acción no se puede deshacer. La jornada será eliminada permanentemente.",
            () => {
                const workdays = JSON.parse(localStorage.getItem(STORAGE_KEYS.WORKDAYS) || '[]');
                const filtered = workdays.filter(w => w.timestamp !== timestamp);
                localStorage.setItem(STORAGE_KEYS.WORKDAYS, JSON.stringify(filtered));
                setHistoryKey(prev => prev + 1);
                showNotification('✅ Jornada eliminada');
            }
        );
    };

    // Funciones auxiliares para edición
    const addBreakToEdit = (duration, name = "", isEffectiveTime = false) => {
        setEditFormData(prev => ({
            ...prev,
            breaks: [...prev.breaks, { duration, name, isEffectiveTime }]
        }));
    };

    const removeBreakFromEdit = (index) => {
        setEditFormData(prev => ({
            ...prev,
            breaks: prev.breaks.filter((_, i) => i !== index)
        }));
    };

    const updateBreakInEdit = (index, field, value) => {
        setEditFormData(prev => {
            const newBreaks = [...prev.breaks];
            if (field === 'duration') {
                newBreaks[index].duration = parseInt(value) || 0;
            } else if (field === 'isEffectiveTime') {
                newBreaks[index].isEffectiveTime = value;
            }
            return { ...prev, breaks: newBreaks };
        });
    };

    // Notificación visual
    const showNotification = (message) => {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl z-[9999] animate-slide-in';
        notification.innerHTML = `<div class="font-bold text-lg">${message}</div>`;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    };

    return {
        // Estados
        workDayType,
        customHours,
        startTime,
        breaks,
        endTime,
        isLiveMode,
        currentTime,
        activeView,
        showCustomBreakModal,
        customBreakName,
        customBreakDuration,
        customBreakIsEffective,
        editingWorkday,
        showEditModal,
        editFormData,
        weekWorkdays,
        lastBackup,
        confirmModal,
        
        // Setters
        setWorkDayType,
        setCustomHours,
        setStartTime,
        setActiveView,
        setShowCustomBreakModal,
        setCustomBreakName,
        setCustomBreakDuration,
        setCustomBreakIsEffective,
        setEditFormData,
        setShowEditModal,
        
        // Funciones
        handleWorkDayTypeChange,
        handleStartTimeChange,
        handleCustomHoursChange,
        addBreak,
        removeBreak,
        updateBreak,
        addCustomBreak,
        startLiveTracking,
        stopLiveTracking,
        setCurrentTimeAsStart,
        exportData,
        importData,
        openEditModal,
        saveEditedWorkday,
        deleteWorkday,
        addBreakToEdit,
        removeBreakFromEdit,
        updateBreakInEdit,
        showConfirm,
        closeConfirm,
    };
}
