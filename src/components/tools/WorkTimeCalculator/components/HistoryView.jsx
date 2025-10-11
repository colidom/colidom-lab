import React from "react";
import { MdHistory } from "react-icons/md";
import WeeklyStats from "./WeeklyStats";
import WorkdayCard from "./WorkdayCard";

export default function HistoryView({ weekWorkdays, onEditWorkday, onDeleteWorkday }) {
    return (
        <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 dark:from-purple-900/20 dark:to-pink-900/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-700/50">
            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-6 flex items-center gap-3">
                <MdHistory className="text-3xl" />
                Resumen de Esta Semana
            </h2>

            {weekWorkdays.length > 0 ? (
                <>
                    <WeeklyStats weekWorkdays={weekWorkdays} />

                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Detalle por día:</h3>
                        {weekWorkdays.map((workday, index) => (
                            <WorkdayCard
                                key={index}
                                workday={workday}
                                onEdit={onEditWorkday}
                                onDelete={onDeleteWorkday}
                            />
                        ))}
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
    );
}
