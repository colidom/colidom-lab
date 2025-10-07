import React, { useState, useEffect } from "react";
import { MdContentCopy, MdAccessTime } from "react-icons/md";

export default function TimestampConverter() {
    const [timestamp, setTimestamp] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [copiedField, setCopiedField] = useState("");

    // Actualizar tiempo actual cada segundo
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Convertir timestamp a fecha
    const timestampToDate = (ts) => {
        try {
            const num = parseInt(ts);
            if (isNaN(num)) return null;
            
            // Detectar si es en segundos o milisegundos
            const milliseconds = num.toString().length <= 10 ? num * 1000 : num;
            const date = new Date(milliseconds);
            
            if (isNaN(date.getTime())) return null;
            return date;
        } catch {
            return null;
        }
    };

    // Convertir fecha a timestamp
    const dateToTimestamp = (dateStr) => {
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return null;
            return date.getTime();
        } catch {
            return null;
        }
    };

    const handleTimestampChange = (value) => {
        setTimestamp(value);
        if (value.trim()) {
            const date = timestampToDate(value);
            if (date) {
                setDateTime(date.toISOString().slice(0, 16));
            }
        }
    };

    const handleDateTimeChange = (value) => {
        setDateTime(value);
        if (value) {
            const ts = dateToTimestamp(value);
            if (ts) {
                setTimestamp(Math.floor(ts / 1000).toString());
            }
        }
    };

    const handleCopy = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(""), 2000);
    };

    const setToNow = () => {
        const now = Date.now();
        setTimestamp(Math.floor(now / 1000).toString());
        setDateTime(new Date(now).toISOString().slice(0, 16));
    };

    const formatDate = (date) => {
        return date.toLocaleString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        });
    };

    const parsedDate = timestamp ? timestampToDate(timestamp) : null;

    return (
        <div className="flex flex-col gap-6">
            {/* Tiempo Actual */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 
                backdrop-blur-xl shadow-lg border-2 border-teal-200 dark:border-teal-800">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-2">
                        <MdAccessTime size={24} className="animate-spin" style={{ animationDuration: '3s' }} />
                        Tiempo Actual
                    </h3>
                    <button
                        onClick={setToNow}
                        className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white 
                            transition-colors duration-200 text-sm font-semibold"
                    >
                        Usar Ahora
                    </button>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/60 dark:bg-gray-800/60">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Unix (segundos):</span>
                        <div className="flex items-center gap-2">
                            <code className="text-lg font-mono font-bold text-teal-600 dark:text-teal-400">
                                {Math.floor(currentTime / 1000)}
                            </code>
                            <button
                                onClick={() => handleCopy(Math.floor(currentTime / 1000).toString(), 'current-unix')}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                            >
                                <MdContentCopy size={16} />
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/60 dark:bg-gray-800/60">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Milisegundos:</span>
                        <div className="flex items-center gap-2">
                            <code className="text-lg font-mono font-bold text-teal-600 dark:text-teal-400">
                                {currentTime}
                            </code>
                            <button
                                onClick={() => handleCopy(currentTime.toString(), 'current-ms')}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                            >
                                <MdContentCopy size={16} />
                            </button>
                        </div>
                    </div>
                    <div className="p-3 rounded-lg bg-white/60 dark:bg-gray-800/60">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            {formatDate(new Date(currentTime))}
                        </p>
                    </div>
                </div>
            </div>

            {/* Convertir Timestamp a Fecha */}
            <div className="p-6 rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">
                    🔢 Timestamp a Fecha
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Unix Timestamp (segundos o milisegundos)
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={timestamp}
                                onChange={(e) => handleTimestampChange(e.target.value)}
                                placeholder="1699999999 o 1699999999000"
                                className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                                    bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm font-mono
                                    text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {timestamp && (
                                <button
                                    onClick={() => handleCopy(timestamp, 'timestamp')}
                                    className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white 
                                        transition-colors duration-200"
                                >
                                    <MdContentCopy size={20} />
                                </button>
                            )}
                        </div>
                    </div>

                    {parsedDate && (
                        <div className="p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
                            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">Resultado:</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between items-center p-2 rounded bg-white/50 dark:bg-gray-800/50">
                                    <span className="text-gray-600 dark:text-gray-400">ISO 8601:</span>
                                    <code className="font-mono text-blue-700 dark:text-blue-300">{parsedDate.toISOString()}</code>
                                </div>
                                <div className="flex justify-between items-center p-2 rounded bg-white/50 dark:bg-gray-800/50">
                                    <span className="text-gray-600 dark:text-gray-400">UTC:</span>
                                    <code className="font-mono text-blue-700 dark:text-blue-300">{parsedDate.toUTCString()}</code>
                                </div>
                                <div className="flex justify-between items-center p-2 rounded bg-white/50 dark:bg-gray-800/50">
                                    <span className="text-gray-600 dark:text-gray-400">Local:</span>
                                    <code className="font-mono text-blue-700 dark:text-blue-300">{formatDate(parsedDate)}</code>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Convertir Fecha a Timestamp */}
            <div className="p-6 rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-4">
                    📅 Fecha a Timestamp
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Selecciona Fecha y Hora
                        </label>
                        <input
                            type="datetime-local"
                            value={dateTime}
                            onChange={(e) => handleDateTimeChange(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                                bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm
                                text-gray-900 dark:text-white
                                focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {dateTime && (
                        <div className="p-4 rounded-lg bg-purple-50/50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
                            <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-3">Resultado:</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between items-center p-2 rounded bg-white/50 dark:bg-gray-800/50">
                                    <span className="text-gray-600 dark:text-gray-400">Unix (segundos):</span>
                                    <div className="flex items-center gap-2">
                                        <code className="font-mono text-purple-700 dark:text-purple-300 font-bold">
                                            {Math.floor(dateToTimestamp(dateTime) / 1000)}
                                        </code>
                                        <button
                                            onClick={() => handleCopy(Math.floor(dateToTimestamp(dateTime) / 1000).toString(), 'date-unix')}
                                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                                        >
                                            <MdContentCopy size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center p-2 rounded bg-white/50 dark:bg-gray-800/50">
                                    <span className="text-gray-600 dark:text-gray-400">Milisegundos:</span>
                                    <div className="flex items-center gap-2">
                                        <code className="font-mono text-purple-700 dark:text-purple-300 font-bold">
                                            {dateToTimestamp(dateTime)}
                                        </code>
                                        <button
                                            onClick={() => handleCopy(dateToTimestamp(dateTime).toString(), 'date-ms')}
                                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                                        >
                                            <MdContentCopy size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Información */}
            <div className="p-6 rounded-xl bg-blue-50/50 dark:bg-blue-900/20 backdrop-blur-sm border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">ℹ️ Sobre Unix Timestamp</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-2 list-disc list-inside">
                    <li><strong>Unix Timestamp:</strong> Número de segundos desde el 1 de enero de 1970 (Epoch)</li>
                    <li><strong>Milisegundos:</strong> Mismo concepto pero en milisegundos (JavaScript usa esto)</li>
                    <li><strong>ISO 8601:</strong> Formato estándar internacional para fechas y horas</li>
                    <li>Útil para sincronización de sistemas y bases de datos</li>
                </ul>
            </div>
        </div>
    );
}
