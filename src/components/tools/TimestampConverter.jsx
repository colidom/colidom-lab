import React, { useState, useEffect } from "react";
import { MdContentCopy, MdAccessTime, MdCalendarToday, MdUpdate, MdCheckCircle } from "react-icons/md";

export default function TimestampConverter() {
    const [timestamp, setTimestamp] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [mode, setMode] = useState("toDate"); // 'toDate' or 'toTimestamp'
    const [copiedField, setCopiedField] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const timestampToDate = (ts) => {
        try {
            const num = parseInt(ts);
            if (isNaN(num)) return null;
            const milliseconds = num.toString().length <= 10 ? num * 1000 : num;
            const date = new Date(milliseconds);
            if (isNaN(date.getTime())) return null;
            return date;
        } catch {
            return null;
        }
    };

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
        navigator.clipboard.writeText(text.toString());
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
        <div className="space-y-6">
            {/* Sección: Tiempo Actual */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 
                backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-teal-200/50 dark:border-teal-800/50">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full"></div>
                        <h2 className="text-xl font-bold text-teal-600 dark:text-teal-400 flex items-center gap-2">
                            <MdAccessTime className="text-2xl animate-spin" style={{ animationDuration: '3s' }} />
                            Tiempo Actual (En Vivo)
                        </h2>
                    </div>
                    <button
                        onClick={setToNow}
                        className="px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2
                            bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md
                            hover:from-teal-600 hover:to-cyan-600 hover:scale-105"
                    >
                        <MdUpdate />
                        Usar Ahora
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-teal-200 dark:border-teal-800">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Unix (segundos)</span>
                            <button
                                onClick={() => handleCopy(Math.floor(currentTime / 1000), 'current-unix')}
                                className="p-1.5 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors"
                            >
                                {copiedField === 'current-unix' ? (
                                    <MdCheckCircle className="text-green-500" />
                                ) : (
                                    <MdContentCopy className="text-gray-500" />
                                )}
                            </button>
                        </div>
                        <code className="text-2xl font-mono font-bold text-teal-600 dark:text-teal-400">
                            {Math.floor(currentTime / 1000)}
                        </code>
                    </div>

                    <div className="p-4 rounded-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-cyan-200 dark:border-cyan-800">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Milisegundos</span>
                            <button
                                onClick={() => handleCopy(currentTime, 'current-ms')}
                                className="p-1.5 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900 transition-colors"
                            >
                                {copiedField === 'current-ms' ? (
                                    <MdCheckCircle className="text-green-500" />
                                ) : (
                                    <MdContentCopy className="text-gray-500" />
                                )}
                            </button>
                        </div>
                        <code className="text-2xl font-mono font-bold text-cyan-600 dark:text-cyan-400">
                            {currentTime}
                        </code>
                    </div>
                </div>

                <div className="mt-4 p-4 rounded-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <MdCalendarToday className="text-teal-500" />
                        {formatDate(new Date(currentTime))}
                    </p>
                </div>
            </div>

            {/* Sección: Modo de conversión */}
            <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full"></div>
                    <h2 className="text-xl font-bold text-teal-600 dark:text-teal-400">Modo de Conversión</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => setMode("toDate")}
                        className={`
                            group relative px-6 py-5 rounded-xl font-medium transition-all duration-300
                            flex items-center gap-4
                            ${mode === "toDate"
                                ? 'bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30 scale-[1.02]'
                                : 'bg-white/70 dark:bg-gray-900/70 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900 hover:shadow-md border border-gray-200 dark:border-gray-700'
                            }
                        `}
                    >
                        <MdAccessTime className={`text-3xl ${mode === "toDate" ? 'text-white' : 'text-teal-500'} transition-transform group-hover:scale-110`} />
                        <div className="flex-1 text-left">
                            <div className="font-bold text-lg">Timestamp → Fecha</div>
                            <div className={`text-sm ${mode === "toDate" ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>
                                Convierte números a fechas
                            </div>
                        </div>
                        {mode === "toDate" && (
                            <MdCheckCircle className="text-white text-2xl" />
                        )}
                    </button>

                    <button
                        onClick={() => setMode("toTimestamp")}
                        className={`
                            group relative px-6 py-5 rounded-xl font-medium transition-all duration-300
                            flex items-center gap-4
                            ${mode === "toTimestamp"
                                ? 'bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30 scale-[1.02]'
                                : 'bg-white/70 dark:bg-gray-900/70 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900 hover:shadow-md border border-gray-200 dark:border-gray-700'
                            }
                        `}
                    >
                        <MdCalendarToday className={`text-3xl ${mode === "toTimestamp" ? 'text-white' : 'text-teal-500'} transition-transform group-hover:scale-110`} />
                        <div className="flex-1 text-left">
                            <div className="font-bold text-lg">Fecha → Timestamp</div>
                            <div className={`text-sm ${mode === "toTimestamp" ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>
                                Convierte fechas a números
                            </div>
                        </div>
                        {mode === "toTimestamp" && (
                            <MdCheckCircle className="text-white text-2xl" />
                        )}
                    </button>
                </div>
            </div>

            {/* Sección: Conversor */}
            {mode === "toDate" ? (
                <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-1 h-8 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full"></div>
                        <h2 className="text-xl font-bold text-teal-600 dark:text-teal-400">Timestamp a Fecha</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Unix Timestamp (segundos o milisegundos)
                            </label>
                            <input
                                type="text"
                                value={timestamp}
                                onChange={(e) => handleTimestampChange(e.target.value)}
                                placeholder="1699999999 o 1699999999000"
                                className="w-full px-4 py-3 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 
                                    focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all font-mono text-lg
                                    bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700
                                    shadow-inner"
                            />
                        </div>

                        {parsedDate && (
                            <div className="p-5 rounded-xl bg-teal-50/50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 space-y-3 animate-slide-in">
                                <h4 className="font-semibold text-teal-800 dark:text-teal-300 mb-3">Resultado:</h4>
                                {[
                                    { label: "ISO 8601", value: parsedDate.toISOString(), key: "iso" },
                                    { label: "UTC", value: parsedDate.toUTCString(), key: "utc" },
                                    { label: "Local", value: formatDate(parsedDate), key: "local" }
                                ].map(({ label, value, key }) => (
                                    <div key={key} className="flex justify-between items-center p-3 rounded-lg bg-white/70 dark:bg-gray-900/70">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}:</span>
                                        <div className="flex items-center gap-2">
                                            <code className="text-sm font-mono text-teal-700 dark:text-teal-300">{value}</code>
                                            <button
                                                onClick={() => handleCopy(value, key)}
                                                className="p-1.5 rounded hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors"
                                            >
                                                {copiedField === key ? (
                                                    <MdCheckCircle className="text-green-500" />
                                                ) : (
                                                    <MdContentCopy className="text-gray-500" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-1 h-8 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full"></div>
                        <h2 className="text-xl font-bold text-teal-600 dark:text-teal-400">Fecha a Timestamp</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Selecciona Fecha y Hora
                            </label>
                            <input
                                type="datetime-local"
                                value={dateTime}
                                onChange={(e) => handleDateTimeChange(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl text-gray-900 dark:text-white
                                    focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all
                                    bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
                            />
                        </div>

                        {dateTime && (
                            <div className="p-5 rounded-xl bg-cyan-50/50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 space-y-3 animate-slide-in">
                                <h4 className="font-semibold text-cyan-800 dark:text-cyan-300 mb-3">Resultado:</h4>
                                {[
                                    { label: "Unix (segundos)", value: Math.floor(dateToTimestamp(dateTime) / 1000), key: "unix-sec" },
                                    { label: "Milisegundos", value: dateToTimestamp(dateTime), key: "unix-ms" }
                                ].map(({ label, value, key }) => (
                                    <div key={key} className="flex justify-between items-center p-3 rounded-lg bg-white/70 dark:bg-gray-900/70">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}:</span>
                                        <div className="flex items-center gap-2">
                                            <code className="text-lg font-mono font-bold text-cyan-700 dark:text-cyan-300">{value}</code>
                                            <button
                                                onClick={() => handleCopy(value, key)}
                                                className="p-1.5 rounded hover:bg-cyan-100 dark:hover:bg-cyan-900 transition-colors"
                                            >
                                                {copiedField === key ? (
                                                    <MdCheckCircle className="text-green-500" />
                                                ) : (
                                                    <MdContentCopy className="text-gray-500" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
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
                            Sobre Unix Timestamp
                        </h3>
                        <div className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
                            <p>
                                <strong>Unix Timestamp</strong> es el número de segundos transcurridos desde el 1 de enero de 1970 00:00:00 UTC (Epoch).
                            </p>
                            <p>
                                <strong>Milisegundos:</strong> JavaScript y muchos sistemas modernos usan milisegundos en lugar de segundos.
                            </p>
                            <p>
                                <strong>ISO 8601:</strong> Formato estándar internacional para fechas (ej: 2024-01-15T10:30:00Z).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
