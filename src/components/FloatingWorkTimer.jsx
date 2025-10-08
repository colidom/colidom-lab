import React, { useState, useEffect, useRef } from "react";
import { MdAccessTime, MdClose, MdWarning, MdCheckCircle, MdRefresh } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "./ui/ConfirmModal";

export default function FloatingWorkTimer() {
    const [workSession, setWorkSession] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isMinimized, setIsMinimized] = useState(false);
    const [lastOvertimeAlert, setLastOvertimeAlert] = useState(0);
    const navigate = useNavigate();
    const widgetRef = useRef(null);

    // Estado para el modal de confirmación
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: null
    });

    // Funciones para manejar el modal
    const showConfirm = (title, message, onConfirm) => {
        setConfirmModal({ isOpen: true, title, message, onConfirm });
    };

    const closeConfirm = () => {
        setConfirmModal({ isOpen: false, title: "", message: "", onConfirm: null });
    };

    // Cargar sesión de trabajo desde sessionStorage
    useEffect(() => {
        const loadWorkSession = () => {
            const session = sessionStorage.getItem('workSession');
            if (session) {
                setWorkSession(JSON.parse(session));
            } else {
                // Si no hay sesión, limpiar el estado
                setWorkSession(null);
            }
        };

        loadWorkSession();

        // Escuchar cambios en sessionStorage
        const handleStorageChange = () => {
            loadWorkSession();
        };

        window.addEventListener('storage', handleStorageChange);
        // Custom event para cambios en la misma pestaña
        window.addEventListener('workSessionUpdate', loadWorkSession);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('workSessionUpdate', loadWorkSession);
        };
    }, []);

    // Cerrar modal cuando se minimiza el widget
    useEffect(() => {
        if (isMinimized && confirmModal.isOpen) {
            closeConfirm();
        }
    }, [isMinimized, confirmModal.isOpen]);

    // Solicitar permisos de notificación al montar
    useEffect(() => {
        if (workSession?.isActive) {
            requestNotificationPermission();
        }
    }, [workSession?.isActive]);

    // Detectar clics fuera del widget para minimizarlo
    useEffect(() => {
        const handleClickOutside = (event) => {
            // No minimizar si hay un modal abierto
            if (confirmModal.isOpen) return;
            
            // Solo minimizar si no está ya minimizado y el clic fue fuera del widget
            if (!isMinimized && widgetRef.current && !widgetRef.current.contains(event.target)) {
                setIsMinimized(true);
            }
        };

        // Solo añadir el listener si el widget no está minimizado
        if (!isMinimized && workSession?.isActive) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMinimized, workSession?.isActive, confirmModal.isOpen]);

    // Actualizar tiempo cada segundo
    useEffect(() => {
        if (workSession?.isActive) {
            const interval = setInterval(() => {
                setCurrentTime(new Date());
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [workSession?.isActive]);

    // Calcular tiempo restante y verificar notificaciones
    useEffect(() => {
        if (!workSession?.isActive) return;

        const remaining = calculateTimeRemaining();
        
        // Notificación cuando termina la jornada
        if (remaining.isOvertime && remaining.totalMinutes === 0) {
            showNotification("⏰ ¡Hora de Salir!", "Tu jornada laboral ha terminado.");
        }

        // Notificaciones cada 30 minutos de overtime
        if (remaining.isOvertime && remaining.totalMinutes > 0) {
            const overtimeIn30MinBlocks = Math.floor(remaining.totalMinutes / 30);
            if (overtimeIn30MinBlocks > lastOvertimeAlert) {
                setLastOvertimeAlert(overtimeIn30MinBlocks);
                showNotification(
                    "⚠️ Horas Extra", 
                    `Llevas ${overtimeIn30MinBlocks * 30} minutos de horas extra`
                );
            }
        }
    }, [currentTime, workSession, lastOvertimeAlert]);

    const calculateTimeRemaining = () => {
        if (!workSession) return { hours: 0, minutes: 0, isOvertime: false, totalMinutes: 0 };

        const [endH, endM] = workSession.endTime.split(":").map(Number);
        const [nowH, nowM] = [currentTime.getHours(), currentTime.getMinutes()];

        const endMinutes = endH * 60 + endM;
        const nowMinutes = nowH * 60 + nowM;

        let remaining = endMinutes - nowMinutes;

        if (remaining < 0) {
            const overtime = Math.abs(remaining);
            return {
                hours: Math.floor(overtime / 60),
                minutes: overtime % 60,
                isOvertime: true,
                totalMinutes: overtime
            };
        }

        return {
            hours: Math.floor(remaining / 60),
            minutes: remaining % 60,
            isOvertime: false,
            totalMinutes: remaining
        };
    };

    const calculateTimeWorked = () => {
        if (!workSession) return { hours: 0, minutes: 0 };

        const [startH, startM] = workSession.startTime.split(":").map(Number);
        const [nowH, nowM] = [currentTime.getHours(), currentTime.getMinutes()];

        const startMinutes = startH * 60 + startM;
        const nowMinutes = nowH * 60 + nowM;

        let workedMinutes = nowMinutes - startMinutes;
        if (workedMinutes < 0) workedMinutes += 24 * 60;

        const effectiveWorkedMinutes = Math.max(0, workedMinutes - workSession.totalBreakMinutes);

        return {
            hours: Math.floor(effectiveWorkedMinutes / 60),
            minutes: effectiveWorkedMinutes % 60
        };
    };

    const showNotification = (title, body) => {
        // Notificación del navegador
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification(title, { body, icon: "/favicon.ico" });
        }

        // Notificación visual en la app (fallback)
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-xl shadow-2xl z-[9999] animate-slide-in';
        notification.innerHTML = `
            <div class="font-bold text-lg mb-1">${title}</div>
            <div class="text-sm">${body}</div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    };

    const requestNotificationPermission = () => {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
    };

    const stopTracking = () => {
        showConfirm(
            "¿Detener seguimiento?",
            "Se detendrá el seguimiento de tu jornada laboral y se perderán los datos actuales.",
            () => {
                sessionStorage.removeItem('workSession');
                setLastOvertimeAlert(0);
                setWorkSession(null);
                
                // Disparar evento después de un pequeño delay para asegurar que React actualice el estado
                setTimeout(() => {
                    window.dispatchEvent(new Event('workSessionUpdate'));
                }, 10);
            }
        );
    };

    const resetTracking = () => {
        showConfirm(
            "¿Resetear contador?",
            "Esto detendrá el seguimiento y eliminará todos los datos de la sesión actual.",
            () => {
                sessionStorage.removeItem('workSession');
                setLastOvertimeAlert(0);
                setWorkSession(null);
                
                // Disparar evento después de un pequeño delay
                setTimeout(() => {
                    window.dispatchEvent(new Event('workSessionUpdate'));
                    showNotification("✅ Contador Reseteado", "El seguimiento de jornada ha sido detenido y reseteado.");
                }, 10);
            }
        );
    };

    const goToCalculator = () => {
        navigate('/utilities/work-time-calculator');
    };

    // No mostrar si no hay sesión activa
    if (!workSession?.isActive) return null;

    const timeRemaining = calculateTimeRemaining();
    const timeWorked = calculateTimeWorked();

    if (isMinimized) {
        return (
            <div className="fixed bottom-4 right-4 z-50">
                <button
                    onClick={() => setIsMinimized(false)}
                    className="group relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 
                        text-white shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110
                        flex items-center justify-center animate-pulse"
                    title="Jornada activa - Clic para expandir"
                >
                    <MdAccessTime className="text-2xl" />
                    {timeRemaining.isOvertime && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-bounce"></div>
                    )}
                </button>
            </div>
        );
    }

    return (
        <div ref={widgetRef} className="fixed bottom-4 right-4 z-50 animate-slide-in">
            {/* Modal de confirmación */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirm}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
            />

            <div className={`w-80 rounded-2xl shadow-2xl backdrop-blur-xl border-2 overflow-hidden
                ${timeRemaining.isOvertime 
                    ? 'bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/40 dark:to-orange-900/40 border-red-400 dark:border-red-600' 
                    : 'bg-gradient-to-br from-white/95 to-white/90 dark:from-gray-800/95 dark:to-gray-800/90 border-blue-300 dark:border-blue-700'
                }`}
            >
                {/* Header */}
                <div className={`px-4 py-3 flex items-center justify-between
                    ${timeRemaining.isOvertime 
                        ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                    }`}
                >
                    <div className="flex items-center gap-2 text-white">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${
                            timeRemaining.isOvertime ? 'bg-yellow-300' : 'bg-green-400'
                        }`}></div>
                        <span className="font-bold text-sm">Jornada Activa</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={resetTracking}
                            className="p-1 hover:bg-white/20 rounded transition-colors group"
                            title="Resetear contador"
                        >
                            <MdRefresh className="text-white text-lg group-hover:rotate-180 transition-transform duration-300" />
                        </button>
                        <button
                            onClick={() => setIsMinimized(true)}
                            className="p-1 hover:bg-white/20 rounded transition-colors"
                            title="Minimizar"
                        >
                            <span className="text-white text-lg">−</span>
                        </button>
                        <button
                            onClick={stopTracking}
                            className="p-1 hover:bg-white/20 rounded transition-colors"
                            title="Detener"
                        >
                            <MdClose className="text-white" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-3">
                    {/* Tiempo Restante/Overtime */}
                    <div className={`p-4 rounded-xl ${
                        timeRemaining.isOvertime 
                            ? 'bg-red-500 text-white' 
                            : 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30'
                    }`}>
                        <div className="flex items-center gap-2 mb-2">
                            {timeRemaining.isOvertime ? (
                                <MdWarning className="text-2xl" />
                            ) : (
                                <MdAccessTime className="text-xl text-blue-600 dark:text-blue-400" />
                            )}
                            <span className={`text-sm font-medium ${
                                timeRemaining.isOvertime 
                                    ? 'text-white' 
                                    : 'text-gray-600 dark:text-gray-400'
                            }`}>
                                {timeRemaining.isOvertime ? 'Horas Extra' : 'Tiempo Restante'}
                            </span>
                        </div>
                        <div className={`text-3xl font-bold ${
                            timeRemaining.isOvertime 
                                ? 'text-white' 
                                : 'text-blue-600 dark:text-blue-400'
                        }`}>
                            {timeRemaining.hours}h {timeRemaining.minutes}m
                        </div>
                    </div>

                    {/* Tiempo Trabajado */}
                    <div className="p-3 rounded-xl bg-white/70 dark:bg-gray-900/70">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Trabajado</div>
                        <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                            {timeWorked.hours}h {timeWorked.minutes}m
                        </div>
                    </div>

                    {/* Horarios */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-lg bg-white/50 dark:bg-gray-900/50">
                            <div className="text-gray-500 dark:text-gray-400">Entrada</div>
                            <div className="font-mono font-bold text-gray-800 dark:text-gray-200">
                                {workSession.startTime}
                            </div>
                        </div>
                        <div className="p-2 rounded-lg bg-white/50 dark:bg-gray-900/50">
                            <div className="text-gray-500 dark:text-gray-400">Salida</div>
                            <div className="font-mono font-bold text-gray-800 dark:text-gray-200">
                                {workSession.endTime}
                            </div>
                        </div>
                    </div>

                    {/* Alerta para horas extras extremas */}
                    {timeRemaining.isOvertime && timeRemaining.hours > 10 && (
                        <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700">
                            <div className="flex items-center gap-2 text-red-800 dark:text-red-300 text-sm">
                                <MdWarning className="text-lg flex-shrink-0" />
                                <span>¿Olvidaste detener el contador? Usa el botón de reset ↻</span>
                            </div>
                        </div>
                    )}

                    {/* Botón Ver Detalle */}
                    <button
                        onClick={goToCalculator}
                        className="w-full py-2 rounded-lg font-medium text-sm transition-all duration-300
                            bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
                    >
                        Ver Detalle Completo
                    </button>
                </div>
            </div>
        </div>
    );
}
