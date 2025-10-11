import React from "react";
import { MdEdit, MdDelete } from "react-icons/md";

export default function WorkdayCard({ workday, onEdit, onDelete }) {
    const date = new Date(workday.timestamp);
    const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });
    const dateStr = date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
    
    return (
        <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
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
                            onClick={() => onEdit(workday)}
                            className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
                            title="Editar jornada"
                        >
                            <MdEdit className="text-blue-600 dark:text-blue-400 text-lg group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                            onClick={() => onDelete(workday.timestamp)}
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
}
