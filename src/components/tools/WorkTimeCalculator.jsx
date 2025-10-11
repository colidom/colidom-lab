import React, { useState, useEffect } from "react";
import { MdAccessTime, MdLunchDining, MdCheckCircle, MdPlayArrow, MdStop, MdAdd, MdDelete, MdCalendarToday, MdHistory, MdCalculate, MdFileDownload, MdFileUpload, MdSync, MdWarning, MdEdit } from "react-icons/md";
import ConfirmModal from "../ui/ConfirmModal";

export default function WorkTimeCalculator() {
    const [workDayType, setWorkDayType] = useState("normal");
    const [customHours, setCustomHours] = useState(8.5);
    const [startTime, setStartTime] = useState("");
    const [breaks, setBreaks] = useState([]);
    const [endTime, setEndTime] = useState("");
    const [isLiveMode, setIsLiveMode] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    
    // Estado para modal de descanso personalizado
    const [showCustomBreakModal, setShowCustomBreakModal] = useState(false);
    const [customBreakName, setCustomBreakName] = useState("");
    const [customBreakDuration, setCustomBreakDuration] = useState(30);
    const [customBreakIsEffective, setCustomBreakIsEffective] = useState(false);
    
    // Estado para vista activa (calculadora o historial)
    const [activeView, setActiveView] = useState('calculator'); // 'calculator' o 'history'
    
    // Estado para el último backup
    const [lastBackup, setLastBackup] = useState(() => {
        const last = localStorage.getItem('lastBackupDate');
        return last ? new Date(last) : null;
    });
    
    // Estado para edición de jornadas
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
    
    // Estado para forzar re-render del historial
    const [historyKey, setHistoryKey] = useState(0);
    
    // Estado para el modal de confirmación
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: null
    });

    // Función para abrir modal de confirmación
    const showConfirm = (title, message, onConfirm) => {
        setConfirmModal({
            isOpen: true,
            title,
            message,
            onConfirm
        });
    };

    // Función para cerrar modal de confirmación
    const closeConfirm = () => {
        setConfirmModal({
            isOpen: false,
            title: "",
            message: "",
            onConfirm: null
        });
    };

    // Manejar cambio de tipo de jornada con confirmación
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

    // Manejar cambio de hora de entrada con confirmación
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

    // Manejar cambio de horas personalizadas con confirmación
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

    // Cargar sesión existente al montar
    useEffect(() => {
        const savedSession = sessionStorage.getItem('workSession');
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
            // Limpiar sessionStorage completamente
            sessionStorage.clear();
            
            // Resetear todos los campos a sus valores por defecto
            setStartTime("");
            setEndTime("");
            setWorkDayType("normal");
            setCustomHours(8.5);
            setBreaks([]);
            setIsLiveMode(false);
        };

        window.addEventListener('workSessionReset', handleReset);
        
        return () => {
            window.removeEventListener('workSessionReset', handleReset);
        };
    }, []);

    // Escuchar cambios en la sesión de trabajo (cuando el widget detiene el seguimiento)
    useEffect(() => {
        const handleSessionUpdate = () => {
            const savedSession = sessionStorage.getItem('workSession');
            
            if (!savedSession) {
                // Si no hay sesión y el modo live está activo, desactivarlo
                if (isLiveMode) {
                    setIsLiveMode(false);
                }
            }
        };

        // Escuchar el evento personalizado
        window.addEventListener('workSessionUpdate', handleSessionUpdate);
        
        return () => {
            window.removeEventListener('workSessionUpdate', handleSessionUpdate);
        };
    }, [isLiveMode]); // Solo depende de isLiveMode

    // Guardar en sessionStorage cuando cambia el estado
    useEffect(() => {
        if (isLiveMode && startTime && endTime) {
            const totalBreakMinutes = breaks.reduce((sum, b) => sum + (b.duration || 0), 0);
            const targetHours = workDayType === "normal" ? 8.5 : 
                              workDayType === "friday" ? 6 : 
                              workDayType === "summer" ? 7 : 
                              customHours;
            
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
            
            sessionStorage.setItem('workSession', JSON.stringify(workSession));
            // Disparar evento para notificar al widget
            window.dispatchEvent(new Event('workSessionUpdate'));
        } else if (!isLiveMode) {
            sessionStorage.removeItem('workSession');
            window.dispatchEvent(new Event('workSessionUpdate'));
        }
    }, [isLiveMode, startTime, endTime, breaks, workDayType, customHours]);

    // Actualizar tiempo actual cada segundo en modo live
    useEffect(() => {
        if (isLiveMode) {
            const interval = setInterval(() => {
                setCurrentTime(new Date());
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isLiveMode]);

    // Calcular hora de salida
    useEffect(() => {
        if (!startTime) {
            setEndTime("");
            return;
        }

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
        setEndTime(`${endHours}:${endMinutes}`);
    }, [startTime, breaks, workDayType, customHours]);

    const addBreak = (duration, name = "", isEffectiveTime = false) => {
        setBreaks([...breaks, { duration, name, isEffectiveTime }]);
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

    const startLiveTracking = () => {
        if (!startTime) {
            alert("Por favor, introduce primero tu hora de entrada");
            return;
        }
        
        // Limpiar sessionStorage antes de empezar nuevo seguimiento
        sessionStorage.clear();
        
        // Solicitar permisos de notificación
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
        
        setIsLiveMode(true);
        setCurrentTime(new Date());
    };

    // Guardar jornada completada en localStorage
    const saveCompletedWorkday = () => {
        if (!startTime || !endTime || !isLiveMode) return;

        const now = new Date();
        const [startH, startM] = startTime.split(":").map(Number);
        const [endH, endM] = endTime.split(":").map(Number);
        
        const startMinutes = startH * 60 + startM;
        let endMinutes = endH * 60 + endM;
        let currentMinutes = now.getHours() * 60 + now.getMinutes();
        
        // Ajustar si cruza medianoche
        if (endMinutes < startMinutes) {
            endMinutes += 1440;
        }
        if (currentMinutes < startMinutes && endMinutes > 1440) {
            currentMinutes += 1440;
        }
        
        const totalMinutes = currentMinutes - startMinutes;
        // Solo descontar descansos que NO son tiempo efectivo
        const breakMinutes = breaks.reduce((sum, b) => {
            return sum + (b.isEffectiveTime ? 0 : (b.duration || 0));
        }, 0);
        const effectiveMinutes = totalMinutes - breakMinutes;
        
        // Calcular horas objetivo según tipo de jornada
        const targetHours = workDayType === "normal" ? 8.5 : 
                          workDayType === "friday" ? 6 : 
                          workDayType === "summer" ? 7 : 
                          customHours;
        const targetMinutes = targetHours * 60;
        const overtimeMinutes = effectiveMinutes - targetMinutes;
        
        const workday = {
            date: now.toISOString().split('T')[0], // YYYY-MM-DD
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
        
        // Obtener jornadas guardadas
        const savedWorkdays = JSON.parse(localStorage.getItem('workdays') || '[]');
        savedWorkdays.push(workday);
        
        // Mantener solo últimos 90 días
        const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);
        const filteredWorkdays = savedWorkdays.filter(w => w.timestamp > ninetyDaysAgo);
        
        localStorage.setItem('workdays', JSON.stringify(filteredWorkdays));
    };

    // Exportar datos a JSON con backup automático
    const exportData = () => {
        const workdays = localStorage.getItem('workdays') || '[]';
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
        
        // Guardar fecha del último backup
        const now = new Date();
        localStorage.setItem('lastBackupDate', now.toISOString());
        setLastBackup(now);
    };

    // Importar datos desde JSON
    const importData = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                // Validar formato
                if (!data.workdays || !Array.isArray(data.workdays)) {
                    alert('❌ Archivo inválido: formato incorrecto');
                    return;
                }
                
                // Hacer backup automático antes de importar
                exportData();
                
                // Merge con datos existentes
                const existing = JSON.parse(localStorage.getItem('workdays') || '[]');
                const merged = [...existing, ...data.workdays];
                
                // Eliminar duplicados (por fecha + hora de entrada)
                const unique = merged.reduce((acc, curr) => {
                    const exists = acc.find(w => 
                        w.date === curr.date && 
                        w.startTime === curr.startTime
                    );
                    if (!exists) {
                        acc.push(curr);
                    }
                    return acc;
                }, []);
                
                // Ordenar por fecha descendente
                unique.sort((a, b) => new Date(b.date) - new Date(a.date));
                
                localStorage.setItem('workdays', JSON.stringify(unique));
                alert(`✅ Datos importados exitosamente\n\n📊 Jornadas nuevas: ${data.workdays.length}\n📈 Total en sistema: ${unique.length}`);
                
                // Recargar vista si está en historial
                if (activeView === 'history') {
                    window.location.reload();
                }
            } catch (error) {
                alert('❌ Error al importar: ' + error.message);
            }
        };
        reader.readAsText(file);
        // Limpiar input
        event.target.value = '';
    };

    const stopLiveTracking = () => {
        showConfirm(
            "¿Detener seguimiento?",
            "Se guardará tu jornada actual y se detendrá el seguimiento.",
            () => {
                // Guardar jornada antes de detener
                saveCompletedWorkday();
                
                setIsLiveMode(false);
                sessionStorage.removeItem('workSession');
                sessionStorage.clear(); // Limpiar completamente
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

    const calculateTimeWorked = () => {
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

    const calculateTimeRemaining = () => {
        if (!startTime || !endTime) return { hours: 0, minutes: 0, isOvertime: false };
        
        const [endH, endM] = endTime.split(":").map(Number);
        const [nowH, nowM] = [currentTime.getHours(), currentTime.getMinutes()];

        const endMinutes = endH * 60 + endM;
        const nowMinutes = nowH * 60 + nowM;

        let remaining = endMinutes - nowMinutes;
        
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

    // Re-calcular jornadas de la semana cuando cambia activeView o historyKey
    const [weekWorkdays, setWeekWorkdays] = useState([]);
    
    useEffect(() => {
        if (activeView === 'history') {
            const workdays = JSON.parse(localStorage.getItem('workdays') || '[]');
            const now = new Date();
            const startOfWeek = new Date(now);
            
            // Calcular el lunes de esta semana correctamente
            const dayOfWeek = now.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
            const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Si es domingo, retroceder 6 días
            startOfWeek.setDate(now.getDate() + daysToMonday);
            startOfWeek.setHours(0, 0, 0, 0);
            
            const filtered = workdays.filter(w => {
                const workdayDate = new Date(w.timestamp);
                return workdayDate >= startOfWeek;
            });
            
            setWeekWorkdays(filtered);
        }
    }, [activeView, historyKey]);
    
    // Función para eliminar una jornada
    const deleteWorkday = (timestamp) => {
        showConfirm(
            "¿Eliminar esta jornada?",
            "Esta acción no se puede deshacer. La jornada será eliminada permanentemente.",
            () => {
                const workdays = JSON.parse(localStorage.getItem('workdays') || '[]');
                const filtered = workdays.filter(w => w.timestamp !== timestamp);
                localStorage.setItem('workdays', JSON.stringify(filtered));
                setHistoryKey(prev => prev + 1); // Forzar re-render
                
                // Mostrar notificación de éxito
                const notification = document.createElement('div');
                notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl z-[9999] animate-slide-in';
                notification.innerHTML = '<div class="font-bold text-lg">✅ Jornada eliminada</div>';
                document.body.appendChild(notification);
                setTimeout(() => {
                    notification.style.opacity = '0';
                    notification.style.transition = 'opacity 0.3s';
                    setTimeout(() => notification.remove(), 300);
                }, 2000);
            }
        );
    };
    
    // Función para abrir modal de edición
    const openEditModal = (workday) => {
        setEditingWorkday(workday);
        setEditFormData({
            date: workday.date, // YYYY-MM-DD
            startTime: workday.startTime,
            actualEndTime: workday.actualEndTime,
            workDayType: workday.workDayType,
            customHours: workday.customHours || 8.5,
            breaks: [...(workday.breaks || [])]
        });
        setShowEditModal(true);
    };
    
    // Función para guardar cambios de edición
    const saveEditedWorkday = () => {
        if (!editingWorkday) return;
        
        // Recalcular todos los valores con los nuevos datos
        const [startH, startM] = editFormData.startTime.split(":").map(Number);
        const [endH, endM] = editFormData.actualEndTime.split(":").map(Number);
        
        const startMinutes = startH * 60 + startM;
        let endMinutes = endH * 60 + endM;
        
        // Ajustar si cruza medianoche
        if (endMinutes < startMinutes) {
            endMinutes += 1440;
        }
        
        const totalMinutes = endMinutes - startMinutes;
        const breakMinutes = editFormData.breaks.reduce((sum, b) => {
            return sum + (b.isEffectiveTime ? 0 : (b.duration || 0));
        }, 0);
        const effectiveMinutes = totalMinutes - breakMinutes;
        
        const targetHours = editFormData.workDayType === "normal" ? 8.5 : 
                          editFormData.workDayType === "friday" ? 6 : 
                          editFormData.workDayType === "summer" ? 7 : 
                          editFormData.customHours;
        const targetMinutes = targetHours * 60;
        const overtimeMinutes = effectiveMinutes - targetMinutes;
        
        // Calcular hora de salida esperada
        const totalBreakMinutes = editFormData.breaks.reduce((sum, b) => {
            return sum + (b.isEffectiveTime ? 0 : (b.duration || 0));
        }, 0);
        const expectedEndMinutes = startMinutes + (targetHours * 60) + totalBreakMinutes;
        const expectedEndHours = Math.floor(expectedEndMinutes / 60) % 24;
        const expectedEndMins = expectedEndMinutes % 60;
        const endTime = `${String(expectedEndHours).padStart(2, '0')}:${String(expectedEndMins).padStart(2, '0')}`;
        
        // Recalcular timestamp con la nueva fecha
        const [year, month, day] = editFormData.date.split('-').map(Number);
        const [actEndH, actEndM] = editFormData.actualEndTime.split(':').map(Number);
        const newTimestamp = new Date(year, month - 1, day, actEndH, actEndM).getTime();
        
        // Crear jornada actualizada
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
        
        // Actualizar en localStorage
        const workdays = JSON.parse(localStorage.getItem('workdays') || '[]');
        const updated = workdays.map(w => 
            w.timestamp === editingWorkday.timestamp ? updatedWorkday : w
        );
        localStorage.setItem('workdays', JSON.stringify(updated));
        
        // Cerrar modal y actualizar vista
        setShowEditModal(false);
        setEditingWorkday(null);
        setHistoryKey(prev => prev + 1); // Forzar re-render
        
        // Mostrar notificación de éxito
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl z-[9999] animate-slide-in';
        notification.innerHTML = '<div class="font-bold text-lg">✅ Jornada actualizada</div>';
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    };
    
    // Funciones para manejar el formulario de edición
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
    
    // Calcular estadísticas semanales
    const weekStats = weekWorkdays.reduce((acc, w) => {
        acc.totalEffective += w.effectiveMinutes;
        acc.totalBreaks += w.breakMinutes;
        acc.totalOvertime += w.overtimeMinutes;
        acc.days += 1;
        return acc;
    }, { totalEffective: 0, totalBreaks: 0, totalOvertime: 0, days: 0 });



    const calculateProgressPercentage = () => {
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

    // Calcular descansos: separar tiempo efectivo y no efectivo
    const totalBreakTime = breaks.reduce((sum, b) => sum + (b.duration || 0), 0);
    const effectiveBreakTime = breaks.reduce((sum, b) => sum + (b.isEffectiveTime ? (b.duration || 0) : 0), 0);
    const nonEffectiveBreakTime = totalBreakTime - effectiveBreakTime;
    
    const totalBreakHours = Math.floor(nonEffectiveBreakTime / 60);
    const totalBreakMinutes = nonEffectiveBreakTime % 60;
    const formattedBreakTime = nonEffectiveBreakTime >= 60 
        ? `${totalBreakHours}h ${totalBreakMinutes}min` 
        : `${nonEffectiveBreakTime} min`;
    const targetHours = workDayType === "normal" ? 8.5 : 
                       workDayType === "friday" ? 6 : 
                       workDayType === "summer" ? 7 : 
                       customHours;
    const timeWorked = isLiveMode ? calculateTimeWorked() : null;
    const timeRemaining = isLiveMode && startTime ? calculateTimeRemaining() : null;
    const progress = isLiveMode ? calculateProgressPercentage() : 0;

    const workDayTypes = [
        { id: "normal", name: "Lunes - Jueves", hours: 8.5, icon: "📅", desc: "Jornada estándar" },
        { id: "friday", name: "Viernes", hours: 6, icon: "🎉", desc: "Jornada reducida" },
        { id: "summer", name: "Verano", hours: 7, icon: "☀️", desc: "Jornada intensiva" },
        { id: "custom", name: "Personalizado", hours: customHours, icon: "⚙️", desc: "Horas personalizadas" },
    ];

    return (
        <div className="space-y-6">
            {/* Modal de confirmación */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirm}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
            />

            {/* Banner de Advertencia sobre localStorage */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 backdrop-blur-xl rounded-2xl p-6 shadow-lg border-2 border-amber-300 dark:border-amber-700">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <MdWarning className="text-4xl text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-amber-800 dark:text-amber-300 mb-2">
                            Tus datos se guardan localmente en este navegador
                        </h3>
                        <p className="text-sm text-amber-700 dark:text-amber-400 mb-2">
                            Haz backup periódico para no perderlos. Si limpias el caché del navegador, los datos se perderán.
                        </p>
                        {lastBackup && (
                            <p className="text-xs text-amber-600 dark:text-amber-500 mb-4 font-medium">
                                Último backup: {lastBackup.toLocaleDateString('es-ES', { 
                                    day: '2-digit', 
                                    month: 'short', 
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        )}
                        {!lastBackup && (
                            <p className="text-xs text-red-600 dark:text-red-400 mb-4 font-semibold">
                                ⚠️ Aún no has hecho ningún backup
                            </p>
                        )}
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={exportData}
                                className="px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2
                                    bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg hover:scale-105"
                            >
                                <MdFileDownload className="text-xl" />
                                Exportar Datos (Backup)
                            </button>
                            <label className="px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer
                                bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg hover:scale-105">
                                <MdFileUpload className="text-xl" />
                                Importar Datos
                                <input
                                    type="file"
                                    accept="application/json"
                                    onChange={importData}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pestañas */}
            <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveView('calculator')}
                        className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                            activeView === 'calculator'
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                        <MdCalculate className="text-xl" />
                        Calculadora
                    </button>
                    <button
                        onClick={() => setActiveView('history')}
                        className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                            activeView === 'history'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                        <MdHistory className="text-xl" />
                        Historial
                    </button>
                </div>
            </div>

            {activeView === 'calculator' ? (
                // Vista de Calculadora
                <>

            {/* Alerta de seguimiento activo */}
            {isLiveMode && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-2xl shadow-lg flex items-center gap-3 animate-slide-in">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    <div className="flex-1">
                        <div className="font-bold">Seguimiento Activo</div>
                        <div className="text-sm text-white/90">El widget flotante estará visible en todas las secciones</div>
                    </div>
                    <MdCheckCircle className="text-3xl" />
                </div>
            )}

            {/* Sección: Tipo de Jornada */}
            <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                    <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                        <MdCalendarToday className="text-2xl" />
                        Tipo de Jornada
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {workDayTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => handleWorkDayTypeChange(type.id)}
                            className={`
                                group relative px-6 py-5 rounded-xl font-medium transition-all duration-300
                                flex flex-col items-center gap-3
                                ${workDayType === type.id
                                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30 scale-[1.02]'
                                    : 'bg-white/70 dark:bg-gray-900/70 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900 hover:shadow-md border border-gray-200 dark:border-gray-700'
                                }
                            `}
                        >
                            <span className="text-4xl">{type.icon}</span>
                            <div className="text-center">
                                <div className="font-bold text-lg">{type.name}</div>
                                <div className={`text-sm ${workDayType === type.id ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {type.desc}
                                </div>
                                <div className={`text-2xl font-bold mt-2 ${workDayType === type.id ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`}>
                                    {type.hours}h
                                </div>
                            </div>
                            {workDayType === type.id && (
                                <div className="absolute top-3 right-3">
                                    <MdCheckCircle className="text-white text-xl" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {workDayType === "custom" && (
                    <div className="mt-6 p-5 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30">
                        <label className="block text-sm font-medium text-blue-700 dark:text-blue-400 mb-3">
                            Horas de trabajo objetivo
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="1"
                                max="12"
                                step="0.5"
                                value={customHours}
                                onChange={(e) => handleCustomHoursChange(parseFloat(e.target.value))}
                                className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer
                                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 
                                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br 
                                    [&::-webkit-slider-thumb]:from-blue-500 [&::-webkit-slider-thumb]:to-cyan-500
                                    [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-blue-500/30
                                    [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform
                                    [&::-webkit-slider-thumb]:hover:scale-110"
                            />
                            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400 min-w-[80px] text-center">
                                {customHours}h
                            </span>
                        </div>
                    </div>
                )}

                {/* Info sobre jornada de verano */}
                {workDayType === "summer" && (
                    <div className="mt-6 p-5 rounded-xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">☀️</span>
                            <div>
                                <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">
                                    Jornada Intensiva de Verano
                                </h4>
                                <p className="text-sm text-amber-700 dark:text-amber-400">
                                    Durante el verano (típicamente junio-septiembre), se trabajan 7 horas sin pausa para almorzar, 
                                    permitiendo salir antes y disfrutar más del buen tiempo. 🌴
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Sección: Horario */}
            <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                    <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                        <MdAccessTime className="text-2xl" />
                        Horario de Trabajo
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Hora de Entrada
                        </label>
                        <div className="space-y-2">
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => handleStartTimeChange(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl text-gray-900 dark:text-white text-lg font-mono
                                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all
                                    bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
                            />
                            <button
                                onClick={setCurrentTimeAsStart}
                                className="w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300
                                    bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300
                                    hover:bg-blue-200 dark:hover:bg-blue-900/50 border border-blue-300 dark:border-blue-700"
                            >
                                Usar hora actual
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Hora de Salida (Calculada)
                        </label>
                        <div className="w-full px-4 py-3 rounded-xl text-lg font-mono font-bold text-center
                            bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg flex items-center justify-center gap-2">
                            {endTime || "--:--"}
                            {endTime && <MdCheckCircle className="text-2xl" />}
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    {!isLiveMode ? (
                        <button
                            onClick={startLiveTracking}
                            disabled={!startTime}
                            className="w-full group px-6 py-4 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3
                                bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30
                                hover:from-green-600 hover:to-emerald-600 hover:shadow-xl hover:shadow-green-500/40 hover:scale-[1.02]
                                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <MdPlayArrow className="text-2xl" />
                            Iniciar Seguimiento en Vivo
                        </button>
                    ) : (
                        <button
                            onClick={stopLiveTracking}
                            className="w-full group px-6 py-4 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3
                                bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30
                                hover:from-red-600 hover:to-orange-600 hover:shadow-xl hover:shadow-red-500/40 hover:scale-[1.02]"
                        >
                            <MdStop className="text-2xl" />
                            Detener Seguimiento
                        </button>
                    )}
                </div>
            </div>

            {/* Sección: Descansos */}
            <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                    <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                        <MdLunchDining className="text-2xl" />
                        Descansos
                    </h2>
                </div>

                {/* Botones de selección rápida */}
                <div className="mb-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Añadir descanso:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <button
                            onClick={() => addBreak(15, "Café")}
                            className="group px-4 py-4 rounded-xl font-medium transition-all duration-300
                                bg-white dark:bg-gray-900 border-2 border-blue-300 dark:border-blue-700
                                hover:bg-blue-50 dark:hover:bg-blue-950 hover:scale-105 shadow-md
                                flex flex-col items-center gap-2"
                        >
                            <span className="text-3xl">☕</span>
                            <span className="text-blue-600 dark:text-blue-400 font-bold">15 min</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Café</span>
                        </button>
                        
                        <button
                            onClick={() => addBreak(30, "Almuerzo")}
                            className="group px-4 py-4 rounded-xl font-medium transition-all duration-300
                                bg-white dark:bg-gray-900 border-2 border-blue-300 dark:border-blue-700
                                hover:bg-blue-50 dark:hover:bg-blue-950 hover:scale-105 shadow-md
                                flex flex-col items-center gap-2"
                        >
                            <span className="text-3xl">🍔</span>
                            <span className="text-blue-600 dark:text-blue-400 font-bold">30 min</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Almuerzo</span>
                        </button>
                        
                        <button
                            onClick={() => addBreak(60, "Comida")}
                            className="group px-4 py-4 rounded-xl font-medium transition-all duration-300
                                bg-white dark:bg-gray-900 border-2 border-blue-300 dark:border-blue-700
                                hover:bg-blue-50 dark:hover:bg-blue-950 hover:scale-105 shadow-md
                                flex flex-col items-center gap-2"
                        >
                            <span className="text-3xl">🍽️</span>
                            <span className="text-blue-600 dark:text-blue-400 font-bold">1 hora</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Comida</span>
                        </button>
                        
                        <button
                            onClick={() => setShowCustomBreakModal(true)}
                            className="group px-4 py-4 rounded-xl font-medium transition-all duration-300
                                bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30
                                border-2 border-purple-300 dark:border-purple-700
                                hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-900/50 dark:hover:to-pink-900/50
                                hover:scale-105 shadow-md
                                flex flex-col items-center gap-2"
                        >
                            <span className="text-3xl">⚙️</span>
                            <span className="text-purple-600 dark:text-purple-400 font-bold">Custom</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Personalizado</span>
                        </button>
                    </div>
                </div>

                {/* Modal de descanso personalizado */}
                {showCustomBreakModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                         onClick={() => setShowCustomBreakModal(false)}>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                             onClick={(e) => e.stopPropagation()}>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                                ⚙️ Descanso Personalizado
                            </h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Nombre del descanso
                                    </label>
                                    <input
                                        type="text"
                                        value={customBreakName}
                                        onChange={(e) => setCustomBreakName(e.target.value)}
                                        placeholder="Ej: Reunión, Gimnasio, etc."
                                        className="w-full px-4 py-3 rounded-xl text-gray-900 dark:text-white
                                            focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all
                                            bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Duración (minutos)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="180"
                                        value={customBreakDuration}
                                        onChange={(e) => setCustomBreakDuration(parseInt(e.target.value) || 0)}
                                        className="w-full px-4 py-3 rounded-xl text-gray-900 dark:text-white
                                            focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all
                                            bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                                    />
                                </div>
                                
                                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={customBreakIsEffective}
                                            onChange={(e) => setCustomBreakIsEffective(e.target.checked)}
                                            className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                        <div>
                                            <span className="font-medium text-gray-800 dark:text-gray-200">
                                                ✅ Cuenta como tiempo efectivo de trabajo
                                            </span>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                Marca esto para ausencias que cuentan como trabajadas (médico, formación, reuniones, etc.). Este tiempo NO se descontará de tu jornada.
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowCustomBreakModal(false)}
                                    className="flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-300
                                        bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                                        hover:bg-gray-200 dark:hover:bg-gray-600"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={addCustomBreak}
                                    className="flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-300
                                        bg-gradient-to-r from-purple-500 to-pink-500 text-white
                                        hover:from-purple-600 hover:to-pink-600 shadow-lg"
                                >
                                    Añadir
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Lista de descansos añadidos */}
                {breaks.length > 0 ? (
                    <>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Descansos configurados:</p>
                        <div className="space-y-3">
                            {breaks.map((breakItem, index) => (
                                <div key={index} className={`flex items-center gap-3 p-3 rounded-xl border ${
                                    breakItem.isEffectiveTime 
                                        ? 'bg-green-50/50 dark:bg-green-900/10 border-green-300 dark:border-green-700'
                                        : 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
                                }`}>
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shadow-md ${
                                        breakItem.isEffectiveTime
                                            ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                                            : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                                    }`}>
                                        {breakItem.isEffectiveTime ? '✓' : index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            {breakItem.name && (
                                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    {breakItem.name}
                                                </span>
                                            )}
                                            {breakItem.isEffectiveTime && (
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-green-200 dark:bg-green-900/50 text-green-700 dark:text-green-300 font-medium">
                                                    Tiempo efectivo
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min="0"
                                                max="180"
                                                value={breakItem.duration}
                                                onChange={(e) => updateBreak(index, 'duration', e.target.value)}
                                                className="flex-1 px-4 py-2 rounded-lg text-gray-900 dark:text-white
                                                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all
                                                    bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
                                                placeholder="Minutos"
                                            />
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                min
                                            </span>
                                        </div>
                                        <label className="flex items-center gap-2 mt-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={breakItem.isEffectiveTime || false}
                                                onChange={(e) => updateBreak(index, 'isEffectiveTime', e.target.checked)}
                                                className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                                            />
                                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                                Cuenta como tiempo trabajado
                                            </span>
                                        </label>
                                    </div>
                                    <button
                                        onClick={() => removeBreak(index)}
                                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                    >
                                        <MdDelete className="text-red-500 text-xl" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                        <span className="text-4xl mb-2 block">⏰</span>
                        <p className="text-sm">No hay descansos configurados</p>
                        <p className="text-xs mt-1">Añade uno usando los botones de arriba</p>
                    </div>
                )}

                <div className="mt-4 space-y-2">
                    <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Descansos (se descuentan):</span>
                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formattedBreakTime}</span>
                        </div>
                    </div>
                    {effectiveBreakTime > 0 && (
                        <div className="p-4 rounded-xl bg-green-50/50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-green-700 dark:text-green-400">✅ Tiempo efectivo (se computa):</span>
                                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {effectiveBreakTime >= 60 
                                        ? `${Math.floor(effectiveBreakTime / 60)}h ${effectiveBreakTime % 60}min` 
                                        : `${effectiveBreakTime} min`}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Sección: Resumen */}
            {startTime && endTime && (
                <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 animate-slide-in">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                        <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                            <MdCheckCircle className="text-2xl" />
                            Resumen de tu Jornada
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 text-center">
                            <div className="text-3xl mb-2">⏰</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Entrada</div>
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{startTime}</div>
                        </div>

                        <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-200 dark:border-cyan-800 text-center">
                            <div className="text-3xl mb-2">🏁</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Salida</div>
                            <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{endTime}</div>
                        </div>

                        <div className="p-5 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 text-center">
                            <div className="text-3xl mb-2">💼</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Trabajo</div>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{targetHours}h</div>
                        </div>

                        <div className="p-5 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-800 text-center">
                            <div className="text-3xl mb-2">☕</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Descansos</div>
                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{nonEffectiveBreakTime}m</div>
                            {effectiveBreakTime > 0 && (
                                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                                    +{effectiveBreakTime}m efectivo
                                </div>
                            )}
                        </div>
                    </div>

                    {isLiveMode && timeWorked && (
                        <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-300 dark:border-green-700">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-green-800 dark:text-green-300 flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                    Seguimiento en Vivo
                                </h3>
                                <span className="text-sm text-green-700 dark:text-green-400 font-mono">
                                    {currentTime.toLocaleTimeString('es-ES')}
                                </span>
                            </div>
                            
                            <div className="mb-4">
                                <div className="flex justify-between text-sm text-green-700 dark:text-green-400 mb-2">
                                    <span>Progreso de jornada</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <div className="w-full bg-green-200 dark:bg-green-900/50 rounded-full h-4 overflow-hidden">
                                    <div 
                                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-1000 relative overflow-hidden"
                                        style={{ width: `${Math.min(100, progress)}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg bg-white/70 dark:bg-gray-900/70">
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tiempo trabajado (efectivo)</div>
                                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                                        {timeWorked.hours}h {timeWorked.minutes}m
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                        (descansos ya descontados)
                                    </div>
                                </div>

                                {timeRemaining && (
                                    <div className={`p-4 rounded-lg ${timeRemaining.isOvertime ? 'bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700' : 'bg-white/70 dark:bg-gray-900/70'}`}>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            {timeRemaining.isOvertime ? '⚠️ Horas extra' : '⏳ Tiempo restante'}
                                        </div>
                                        <div className={`text-3xl font-bold ${timeRemaining.isOvertime ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
                                            {timeRemaining.hours}h {timeRemaining.minutes}m
                                        </div>
                                        {timeRemaining.isOvertime && (
                                            <div className="text-xs text-red-600 dark:text-red-400 mt-1 font-semibold">
                                                ¡Ya deberías haber salido!
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Sección: Información */}
            <div className="bg-gradient-to-br from-blue-50/50 to-blue-50/30 dark:from-blue-900/20 dark:to-blue-900/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-blue-200/50 dark:border-blue-800/30">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <span className="text-2xl">💡</span>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">
                            Cómo usar esta herramienta
                        </h3>
                        <div className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
                            <p>
                                <strong>1.</strong> Selecciona el tipo de jornada (normal 8.5h, viernes 6h, verano 7h o personalizado)
                            </p>
                            <p>
                                <strong>2.</strong> Introduce tu hora de entrada (o usa "Usar hora actual" si acabas de entrar)
                            </p>
                            <p>
                                <strong>3.</strong> Configura tus descansos (almuerzo, pausas, etc.)
                            </p>
                            <p className="pl-6 text-xs text-blue-600 dark:text-blue-400">
                                ✅ <strong>Nuevo:</strong> Marca los descansos que cuenten como tiempo trabajado (médico, formación, etc.)
                            </p>
                            <p>
                                <strong>4.</strong> La herramienta calculará automáticamente tu hora de salida
                            </p>
                            <p>
                                <strong>5.</strong> Usa el seguimiento en vivo y el widget flotante te acompañará en toda la app
                            </p>
                            <p className="pt-2 border-t border-blue-200 dark:border-blue-800">
                                <strong>💡 Tip:</strong> El widget flotante permanece visible mientras navegas por otras herramientas y te notificará cuando termine tu jornada y cada 30 minutos de overtime.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            </>
            ) : (
                // Vista de Historial Semanal
                <>
                    {/* Resumen Semanal */}
                    <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 dark:from-purple-900/20 dark:to-pink-900/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-700/50">
                        <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-6 flex items-center gap-3">
                            <MdHistory className="text-3xl" />
                            Resumen de Esta Semana
                        </h2>

                        {weekWorkdays.length > 0 ? (
                            <>
                                {/* Estadísticas Generales */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="p-4 rounded-xl bg-white/70 dark:bg-gray-900/70 border border-purple-200 dark:border-purple-800">
                                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">📅 Días trabajados</div>
                                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{weekStats.days}</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/70 dark:bg-gray-900/70 border border-blue-200 dark:border-blue-800">
                                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">⏱️ Horas trabajadas</div>
                                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            {Math.floor(weekStats.totalEffective / 60)}h {weekStats.totalEffective % 60}m
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/70 dark:bg-gray-900/70 border border-orange-200 dark:border-orange-800">
                                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">☕ Descansos</div>
                                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                            {Math.floor(weekStats.totalBreaks / 60)}h {weekStats.totalBreaks % 60}m
                                        </div>
                                    </div>
                                    <div className={`p-4 rounded-xl bg-white/70 dark:bg-gray-900/70 border ${
                                        weekStats.totalOvertime >= 0 
                                            ? 'border-green-200 dark:border-green-800'
                                            : 'border-red-200 dark:border-red-800'
                                    }`}>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                            {weekStats.totalOvertime >= 0 ? '✅ Horas extra' : '🚨 Debes recuperar'}
                                        </div>
                                        <div className={`text-2xl font-bold ${
                                            weekStats.totalOvertime >= 0 
                                                ? 'text-green-600 dark:text-green-400'
                                                : 'text-red-600 dark:text-red-400'
                                        }`}>
                                            {weekStats.totalOvertime < 0 && '-'}
                                            {Math.floor(Math.abs(weekStats.totalOvertime) / 60)}h {Math.abs(weekStats.totalOvertime) % 60}m
                                        </div>
                                    </div>
                                </div>

                                {/* Lista de Jornadas */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Detalle por día:</h3>
                                    {weekWorkdays.map((workday, index) => {
                                        const date = new Date(workday.timestamp);
                                        const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });
                                        const dateStr = date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
                                        
                                        return (
                                            <div key={index} className="p-4 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div>
                                                        <div className="font-bold text-gray-800 dark:text-gray-200 capitalize">
                                                            {dayName}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">{dateStr}</div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                                            {workday.startTime} - {workday.actualEndTime}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => openEditModal(workday)}
                                                                className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
                                                                title="Editar jornada"
                                                            >
                                                                <MdEdit className="text-blue-600 dark:text-blue-400 text-lg group-hover:scale-110 transition-transform" />
                                                            </button>
                                                            <button
                                                                onClick={() => deleteWorkday(workday.timestamp)}
                                                                className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors group"
                                                                title="Eliminar jornada"
                                                            >
                                                                <MdDelete className="text-red-500 dark:text-red-400 text-lg group-hover:scale-110 transition-transform" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-3 gap-3 text-sm">
                                                    <div>
                                                        <span className="text-gray-500 dark:text-gray-400">Trabajado: </span>
                                                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                                                            {Math.floor(workday.effectiveMinutes / 60)}h {workday.effectiveMinutes % 60}m
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500 dark:text-gray-400">Descansos: </span>
                                                        <span className="font-semibold text-orange-600 dark:text-orange-400">
                                                            {Math.floor(workday.breakMinutes / 60)}h {workday.breakMinutes % 60}m
                                                        </span>
                                                        {workday.breaks && workday.breaks.some(b => b.isEffectiveTime) && (
                                                            <span className="ml-1 text-xs text-green-600 dark:text-green-400">
                                                                (✅ incluye efectivo)
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500 dark:text-gray-400">Balance: </span>
                                                        <span className={`font-semibold ${
                                                            workday.overtimeMinutes >= 0
                                                                ? 'text-green-600 dark:text-green-400'
                                                                : 'text-red-600 dark:text-red-400'
                                                        }`}>
                                                            {workday.overtimeMinutes < 0 && '-'}
                                                            {Math.floor(Math.abs(workday.overtimeMinutes) / 60)}h {Math.abs(workday.overtimeMinutes) % 60}m
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📊</div>
                                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    Sin jornadas esta semana
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Empieza a registrar tus jornadas para ver estadísticas aquí
                                </p>
                            </div>
                        )}
                    </div>
                </>
            )}
            
            {/* Modal de Edición de Jornada */}
            {showEditModal && editingWorkday && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                     onClick={() => setShowEditModal(false)}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                         onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                <MdEdit className="text-blue-600 dark:text-blue-400" />
                                Editar Jornada
                            </h3>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <span className="text-2xl text-gray-500 dark:text-gray-400">×</span>
                            </button>
                        </div>
                        
                        <div className="space-y-6">
                            {/* Fecha (editable) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    📅 Fecha de la Jornada
                                </label>
                                <input
                                    type="date"
                                    value={editFormData.date}
                                    onChange={(e) => setEditFormData(prev => ({ ...prev, date: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl text-gray-900 dark:text-white font-medium
                                        focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all
                                        bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                                />
                                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    Día de la semana: <span className="font-semibold capitalize">
                                        {new Date(editFormData.date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long' })}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Tipo de Jornada */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Tipo de Jornada
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {workDayTypes.map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => setEditFormData(prev => ({ ...prev, workDayType: type.id }))}
                                            className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 flex flex-col items-center gap-2 ${
                                                editFormData.workDayType === type.id
                                                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg'
                                                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                                            }`}
                                        >
                                            <span className="text-2xl">{type.icon}</span>
                                            <span className="text-xs">{type.name}</span>
                                        </button>
                                    ))}
                                </div>
                                {editFormData.workDayType === 'custom' && (
                                    <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
                                        <label className="block text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">
                                            Horas objetivo: {editFormData.customHours}h
                                        </label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="12"
                                            step="0.5"
                                            value={editFormData.customHours}
                                            onChange={(e) => setEditFormData(prev => ({ ...prev, customHours: parseFloat(e.target.value) }))}
                                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer"
                                        />
                                    </div>
                                )}
                            </div>
                            
                            {/* Horarios */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Hora de Entrada
                                    </label>
                                    <input
                                        type="time"
                                        value={editFormData.startTime}
                                        onChange={(e) => setEditFormData(prev => ({ ...prev, startTime: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl text-gray-900 dark:text-white font-mono
                                            focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all
                                            bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Hora de Salida Real
                                    </label>
                                    <input
                                        type="time"
                                        value={editFormData.actualEndTime}
                                        onChange={(e) => setEditFormData(prev => ({ ...prev, actualEndTime: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-xl text-gray-900 dark:text-white font-mono
                                            focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all
                                            bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                                    />
                                </div>
                            </div>
                            
                            {/* Descansos */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Descansos
                                </label>
                                
                                {/* Botones rápidos */}
                                <div className="grid grid-cols-4 gap-2 mb-4">
                                    <button
                                        onClick={() => addBreakToEdit(15, "Café")}
                                        className="px-3 py-2 rounded-lg text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                                    >
                                        ☕ 15min
                                    </button>
                                    <button
                                        onClick={() => addBreakToEdit(30, "Almuerzo")}
                                        className="px-3 py-2 rounded-lg text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                                    >
                                        🍔 30min
                                    </button>
                                    <button
                                        onClick={() => addBreakToEdit(60, "Comida")}
                                        className="px-3 py-2 rounded-lg text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                                    >
                                        🍽️ 1h
                                    </button>
                                    <button
                                        onClick={() => addBreakToEdit(30, "Descanso")}
                                        className="px-3 py-2 rounded-lg text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                                    >
                                        + Añadir
                                    </button>
                                </div>
                                
                                {/* Lista de descansos */}
                                {editFormData.breaks.length > 0 ? (
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {editFormData.breaks.map((breakItem, index) => (
                                            <div key={index} className={`flex items-center gap-2 p-3 rounded-lg border ${
                                                breakItem.isEffectiveTime
                                                    ? 'bg-green-50/50 dark:bg-green-900/10 border-green-300 dark:border-green-700'
                                                    : 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
                                            }`}>
                                                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold ${
                                                    breakItem.isEffectiveTime
                                                        ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                                                        : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                                                }`}>
                                                    {breakItem.isEffectiveTime ? '✓' : index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    {breakItem.name && (
                                                        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                                            {breakItem.name}
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="180"
                                                            value={breakItem.duration}
                                                            onChange={(e) => updateBreakInEdit(index, 'duration', e.target.value)}
                                                            className="w-20 px-2 py-1 rounded text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                                                        />
                                                        <span className="text-xs text-gray-600 dark:text-gray-400">min</span>
                                                        <label className="flex items-center gap-1 cursor-pointer text-xs">
                                                            <input
                                                                type="checkbox"
                                                                checked={breakItem.isEffectiveTime || false}
                                                                onChange={(e) => updateBreakInEdit(index, 'isEffectiveTime', e.target.checked)}
                                                                className="w-3 h-3 text-green-600 rounded"
                                                            />
                                                            <span className="text-gray-600 dark:text-gray-400">Efectivo</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeBreakFromEdit(index)}
                                                    className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                                >
                                                    <MdDelete className="text-red-500 text-lg" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                                        No hay descansos configurados
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Botones de acción */}
                        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-300
                                    bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                                    hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={saveEditedWorkday}
                                className="flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2
                                    bg-gradient-to-r from-blue-500 to-cyan-500 text-white
                                    hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl"
                            >
                                <MdCheckCircle className="text-xl" />
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
