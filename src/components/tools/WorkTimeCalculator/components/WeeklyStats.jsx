import React from "react";

export default function WeeklyStats({ weekWorkdays }) {
    const weekStats = weekWorkdays.reduce((acc, w) => {
        acc.totalEffective += w.effectiveMinutes;
        acc.totalBreaks += w.breakMinutes;
        acc.totalOvertime += w.overtimeMinutes;
        acc.days += 1;
        return acc;
    }, { totalEffective: 0, totalBreaks: 0, totalOvertime: 0, days: 0 });

    return (
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
    );
}
