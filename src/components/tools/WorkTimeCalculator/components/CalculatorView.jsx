import React from "react";
import {
    MdAccessTime, MdLunchDining, MdCheckCircle, MdPlayArrow, MdStop,
    MdCalendarToday, MdDelete, MdWarning, MdFileDownload, MdFileUpload
} from "react-icons/md";
import { WORK_DAY_TYPES, QUICK_BREAKS } from "../constants";
import { calculateTimeWorked, calculateTimeRemaining, calculateProgressPercentage, separateBreaks } from "../utils/timeCalculations";
import CustomBreakModal from "./CustomBreakModal";

export default function CalculatorView({
    workDayType,
    customHours,
    startTime,
    breaks,
    endTime,
    isLiveMode,
    currentTime,
    showCustomBreakModal,
    customBreakName,
    customBreakDuration,
    customBreakIsEffective,
    lastBackup,
    onWorkDayTypeChange,
    onCustomHoursChange,
    onStartTimeChange,
    onSetCurrentTimeAsStart,
    onAddBreak,
    onRemoveBreak,
    onUpdateBreak,
    onStartLiveTracking,
    onStopLiveTracking,
    onExportData,
    onImportData,
    setShowCustomBreakModal,
    setCustomBreakName,
    setCustomBreakDuration,
    setCustomBreakIsEffective,
    onAddCustomBreak
}) {
    const { nonEffectiveBreakTime, effectiveBreakTime } = separateBreaks(breaks);
    const targetHours = workDayType === "normal" ? 8.5 : 
                       workDayType === "friday" ? 6 : 
                       workDayType === "summer" ? 7 : 
                       customHours;
    
    const timeWorked = isLiveMode ? calculateTimeWorked(startTime, currentTime, breaks) : null;
    const timeRemaining = isLiveMode && startTime ? calculateTimeRemaining(endTime, currentTime, startTime) : null;
    const progress = isLiveMode ? calculateProgressPercentage(startTime, endTime, currentTime) : 0;

    const totalBreakHours = Math.floor(nonEffectiveBreakTime / 60);
    const totalBreakMinutes = nonEffectiveBreakTime % 60;
    const formattedBreakTime = nonEffectiveBreakTime >= 60 
        ? `${totalBreakHours}h ${totalBreakMinutes}min` 
        : `${nonEffectiveBreakTime} min`;

    return (
        <>
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
                                onClick={onExportData}
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
                                    onChange={onImportData}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </div>

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
                    {WORK_DAY_TYPES.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => onWorkDayTypeChange(type.id)}
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
                                    {type.id === 'custom' ? `${customHours}h` : `${type.hours}h`}
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
                                onChange={(e) => onCustomHoursChange(parseFloat(e.target.value))}
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

            {/* Continúa en la parte 2... */}
            
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
                                onChange={(e) => onStartTimeChange(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl text-gray-900 dark:text-white text-lg font-mono
                                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all
                                    bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
                            />
                            <button
                                onClick={onSetCurrentTimeAsStart}
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
                            onClick={onStartLiveTracking}
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
                            onClick={onStopLiveTracking}
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

                <div className="mb-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Añadir descanso:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {QUICK_BREAKS.map((qb, idx) => (
                            <button
                                key={idx}
                                onClick={() => onAddBreak(qb.duration, qb.name)}
                                className="group px-4 py-4 rounded-xl font-medium transition-all duration-300
                                    bg-white dark:bg-gray-900 border-2 border-blue-300 dark:border-blue-700
                                    hover:bg-blue-50 dark:hover:bg-blue-950 hover:scale-105 shadow-md
                                    flex flex-col items-center gap-2"
                            >
                                <span className="text-3xl">{qb.icon}</span>
                                <span className="text-blue-600 dark:text-blue-400 font-bold">{qb.label}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{qb.name}</span>
                            </button>
                        ))}
                        
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
                                                onChange={(e) => onUpdateBreak(index, 'duration', e.target.value)}
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
                                                onChange={(e) => onUpdateBreak(index, 'isEffectiveTime', e.target.checked)}
                                                className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                                            />
                                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                                Cuenta como tiempo trabajado
                                            </span>
                                        </label>
                                    </div>
                                    <button
                                        onClick={() => onRemoveBreak(index)}
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
            
            {/* Modal de descanso personalizado */}
            <CustomBreakModal
                isOpen={showCustomBreakModal}
                customBreakName={customBreakName}
                customBreakDuration={customBreakDuration}
                customBreakIsEffective={customBreakIsEffective}
                setCustomBreakName={setCustomBreakName}
                setCustomBreakDuration={setCustomBreakDuration}
                setCustomBreakIsEffective={setCustomBreakIsEffective}
                onClose={() => setShowCustomBreakModal(false)}
                onAdd={onAddCustomBreak}
            />
        </>
    );
}
