import React from "react";

export default function CustomBreakModal({
    isOpen,
    customBreakName,
    customBreakDuration,
    customBreakIsEffective,
    setCustomBreakName,
    setCustomBreakDuration,
    setCustomBreakIsEffective,
    onClose,
    onAdd
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
             onClick={onClose}>
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
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-300
                            bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                            hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onAdd}
                        className="flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-300
                            bg-gradient-to-r from-purple-500 to-pink-500 text-white
                            hover:from-purple-600 hover:to-pink-600 shadow-lg"
                    >
                        Añadir
                    </button>
                </div>
            </div>
        </div>
    );
}
