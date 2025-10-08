import React, { useState, useEffect } from "react";
import { MdAccessTime, MdLunchDining, MdCheckCircle, MdPlayArrow, MdStop, MdAdd, MdDelete, MdCalendarToday } from "react-icons/md";
import ConfirmModal from "../ui/ConfirmModal";

export default function WorkTimeCalculator() {
    const [workDayType, setWorkDayType] = useState("normal");
    const [customHours, setCustomHours] = useState(8.5);
    const [startTime, setStartTime] = useState("");
    const [breaks, setBreaks] = useState([{ duration: 30 }]);
    const [endTime, setEndTime] = useState("");
    const [isLiveMode, setIsLiveMode] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    
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
                setBreaks(session.breaks || [{ duration: 30 }]);
                setIsLiveMode(true);
            }
        }
    }, []);

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
        const totalBreakMinutes = breaks.reduce((sum, b) => sum + (b.duration || 0), 0);
        
        const [hours, minutes] = startTime.split(":").map(Number);
        const startDate = new Date();
        startDate.setHours(hours, minutes, 0, 0);

        const totalMinutes = (targetHours * 60) + totalBreakMinutes;
        const endDate = new Date(startDate.getTime() + totalMinutes * 60000);

        const endHours = String(endDate.getHours()).padStart(2, "0");
        const endMinutes = String(endDate.getMinutes()).padStart(2, "0");
        setEndTime(`${endHours}:${endMinutes}`);
    }, [startTime, breaks, workDayType, customHours]);

    const addBreak = () => {
        setBreaks([...breaks, { duration: 30 }]);
    };

    const removeBreak = (index) => {
        if (breaks.length > 1) {
            setBreaks(breaks.filter((_, i) => i !== index));
        }
    };

    const updateBreak = (index, duration) => {
        const newBreaks = [...breaks];
        newBreaks[index].duration = parseInt(duration) || 0;
        setBreaks(newBreaks);
    };

    const startLiveTracking = () => {
        if (!startTime) {
            alert("Por favor, introduce primero tu hora de entrada");
            return;
        }
        
        // Solicitar permisos de notificación
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
        
        setIsLiveMode(true);
        setCurrentTime(new Date());
    };

    const stopLiveTracking = () => {
        setIsLiveMode(false);
        sessionStorage.removeItem('workSession');
        window.dispatchEvent(new Event('workSessionUpdate'));
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

        const totalBreakMinutes = breaks.reduce((sum, b) => sum + (b.duration || 0), 0);
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

    const totalBreakTime = breaks.reduce((sum, b) => sum + (b.duration || 0), 0);
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
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                        <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                            <MdLunchDining className="text-2xl" />
                            Descansos
                        </h2>
                    </div>
                    <button
                        onClick={addBreak}
                        className="px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2
                            bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-2 border-blue-500
                            hover:bg-blue-50 dark:hover:bg-blue-950 hover:scale-105 shadow-md"
                    >
                        <MdAdd />
                        Añadir
                    </button>
                </div>

                <div className="space-y-3">
                    {breaks.map((breakItem, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 
                                flex items-center justify-center text-white font-bold shadow-md">
                                {index + 1}
                            </div>
                            <div className="flex-1">
                                <input
                                    type="number"
                                    min="0"
                                    max="180"
                                    value={breakItem.duration}
                                    onChange={(e) => updateBreak(index, e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl text-gray-900 dark:text-white
                                        focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all
                                        bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
                                    placeholder="Minutos"
                                />
                            </div>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[60px]">
                                minutos
                            </span>
                            {breaks.length > 1 && (
                                <button
                                    onClick={() => removeBreak(index)}
                                    className="p-3 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                >
                                    <MdDelete className="text-red-500 text-xl" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-4 p-4 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Total de descansos:</span>
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalBreakTime} min</span>
                    </div>
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
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Descanso</div>
                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{totalBreakTime}m</div>
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
        </div>
    );
}
