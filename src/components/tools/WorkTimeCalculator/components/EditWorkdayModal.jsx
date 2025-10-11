import React from "react";
import { MdEdit, MdCheckCircle, MdDelete } from "react-icons/md";

const workDayTypes = [
    { id: "normal", name: "Lunes - Jueves", hours: 8.5, icon: "📅", desc: "Jornada estándar" },
    { id: "friday", name: "Viernes", hours: 6, icon: "🎉", desc: "Jornada reducida" },
    { id: "summer", name: "Verano", hours: 7, icon: "☀️", desc: "Jornada intensiva" },
    { id: "custom", name: "Personalizado", hours: "custom", icon: "⚙️", desc: "Horas personalizadas" },
];

export default function EditWorkdayModal({ 
    editingWorkday, 
    editFormData, 
    setEditFormData,
    onClose, 
    onSave,
    onAddBreak,
    onRemoveBreak,
    onUpdateBreak
}) {
    if (!editingWorkday) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
             onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                 onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <MdEdit className="text-blue-600 dark:text-blue-400" />
                        Editar Jornada
                    </h3>
                    <button
                        onClick={onClose}
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
                                onClick={() => onAddBreak(15, "Café")}
                                className="px-3 py-2 rounded-lg text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                            >
                                ☕ 15min
                            </button>
                            <button
                                onClick={() => onAddBreak(30, "Almuerzo")}
                                className="px-3 py-2 rounded-lg text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                            >
                                🍔 30min
                            </button>
                            <button
                                onClick={() => onAddBreak(60, "Comida")}
                                className="px-3 py-2 rounded-lg text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                            >
                                🍽️ 1h
                            </button>
                            <button
                                onClick={() => onAddBreak(30, "Descanso")}
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
                                                    onChange={(e) => onUpdateBreak(index, 'duration', e.target.value)}
                                                    className="w-20 px-2 py-1 rounded text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                                                />
                                                <span className="text-xs text-gray-600 dark:text-gray-400">min</span>
                                                <label className="flex items-center gap-1 cursor-pointer text-xs">
                                                    <input
                                                        type="checkbox"
                                                        checked={breakItem.isEffectiveTime || false}
                                                        onChange={(e) => onUpdateBreak(index, 'isEffectiveTime', e.target.checked)}
                                                        className="w-3 h-3 text-green-600 rounded"
                                                    />
                                                    <span className="text-gray-600 dark:text-gray-400">Efectivo</span>
                                                </label>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => onRemoveBreak(index)}
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
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-300
                            bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                            hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onSave}
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
    );
}
