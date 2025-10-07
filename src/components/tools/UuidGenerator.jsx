import React, { useState } from "react";
import { MdContentCopy, MdRefresh, MdFingerprint, MdAccessTime, MdCheckCircle } from "react-icons/md";

export default function UuidGenerator() {
    const [uuids, setUuids] = useState([]);
    const [quantity, setQuantity] = useState(5);
    const [version, setVersion] = useState("v4");
    const [isCopied, setIsCopied] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);

    // Generar UUID v4
    const generateUUIDv4 = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    // Generar UUID v1 (simplificado - timestamp based)
    const generateUUIDv1 = () => {
        const timestamp = Date.now();
        const random = Math.random().toString(16).substring(2, 14);
        return `${timestamp.toString(16).padStart(8, '0')}-${random.substring(0, 4)}-1${random.substring(4, 7)}-${random.substring(7, 11)}-${random.substring(11)}${Math.random().toString(16).substring(2, 14)}`.substring(0, 36);
    };

    const handleGenerate = () => {
        const newUuids = [];
        for (let i = 0; i < quantity; i++) {
            newUuids.push(version === "v4" ? generateUUIDv4() : generateUUIDv1());
        }
        setUuids(newUuids);
        setIsCopied(false);
        setCopiedIndex(null);
    };

    const handleCopyAll = () => {
        const text = uuids.join("\n");
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleCopySingle = (uuid, index) => {
        navigator.clipboard.writeText(uuid);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Sección: Tipo de UUID */}
            <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
                    <h2 className="text-xl font-bold text-green-600 dark:text-green-400">Tipo de UUID</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => setVersion("v4")}
                        className={`
                            group relative px-6 py-5 rounded-xl font-medium transition-all duration-300
                            flex items-center gap-4
                            ${version === "v4"
                                ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30 scale-[1.02]'
                                : 'bg-white/70 dark:bg-gray-900/70 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900 hover:shadow-md border border-gray-200 dark:border-gray-700'
                            }
                        `}
                    >
                        <MdFingerprint className={`text-3xl ${version === "v4" ? 'text-white' : 'text-green-500'} transition-transform group-hover:scale-110`} />
                        <div className="flex-1 text-left">
                            <div className="font-bold text-lg">UUID v4</div>
                            <div className={`text-sm ${version === "v4" ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>
                                Aleatorio (Random)
                            </div>
                        </div>
                        {version === "v4" && (
                            <MdCheckCircle className="text-white text-2xl" />
                        )}
                    </button>

                    <button
                        onClick={() => setVersion("v1")}
                        className={`
                            group relative px-6 py-5 rounded-xl font-medium transition-all duration-300
                            flex items-center gap-4
                            ${version === "v1"
                                ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30 scale-[1.02]'
                                : 'bg-white/70 dark:bg-gray-900/70 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900 hover:shadow-md border border-gray-200 dark:border-gray-700'
                            }
                        `}
                    >
                        <MdAccessTime className={`text-3xl ${version === "v1" ? 'text-white' : 'text-green-500'} transition-transform group-hover:scale-110`} />
                        <div className="flex-1 text-left">
                            <div className="font-bold text-lg">UUID v1</div>
                            <div className={`text-sm ${version === "v1" ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>
                                Basado en Timestamp
                            </div>
                        </div>
                        {version === "v1" && (
                            <MdCheckCircle className="text-white text-2xl" />
                        )}
                    </button>
                </div>
            </div>

            {/* Sección: Configuración */}
            <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
                    <h2 className="text-xl font-bold text-green-600 dark:text-green-400">Configuración</h2>
                </div>

                <div className="space-y-6">
                    {/* Cantidad */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Cantidad a generar
                            </label>
                            <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                {quantity}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="100"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                            className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer
                                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 
                                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br 
                                [&::-webkit-slider-thumb]:from-green-500 [&::-webkit-slider-thumb]:to-emerald-500
                                [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-green-500/30
                                [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform
                                [&::-webkit-slider-thumb]:hover:scale-110"
                        />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                            <span>1</span>
                            <span>50</span>
                            <span>100</span>
                        </div>
                    </div>

                    {/* Botón Generar */}
                    <button
                        onClick={handleGenerate}
                        className="w-full group px-6 py-4 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3
                            bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30
                            hover:from-green-600 hover:to-emerald-600 hover:shadow-xl hover:shadow-green-500/40 hover:scale-[1.02]"
                    >
                        <MdRefresh className="text-xl group-hover:rotate-180 transition-transform duration-500" />
                        Generar UUIDs
                    </button>
                </div>
            </div>

            {/* Sección: Resultados */}
            {uuids.length > 0 && (
                <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
                            <h2 className="text-xl font-bold text-green-600 dark:text-green-400">
                                UUIDs Generados ({uuids.length})
                            </h2>
                        </div>
                        <button
                            onClick={handleCopyAll}
                            className="group px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2
                                bg-white dark:bg-gray-900 text-green-600 dark:text-green-400 border-2 border-green-500
                                hover:bg-green-50 dark:hover:bg-green-950 hover:scale-105 shadow-md"
                        >
                            <MdContentCopy className="text-lg" />
                            {isCopied ? "¡Copiados!" : "Copiar Todos"}
                        </button>
                    </div>

                    {/* Lista de UUIDs */}
                    <div className="max-h-[500px] overflow-y-auto space-y-2 custom-scrollbar">
                        {uuids.map((uuid, index) => (
                            <div
                                key={index}
                                className="group relative flex items-center gap-3 p-4 rounded-xl
                                    bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm
                                    border border-gray-200 dark:border-gray-700
                                    hover:border-green-500 dark:hover:border-green-500
                                    hover:shadow-md transition-all duration-300"
                            >
                                {/* Número de índice */}
                                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 
                                    flex items-center justify-center text-white font-bold text-sm shadow-md">
                                    {index + 1}
                                </div>

                                {/* UUID */}
                                <div className="flex-1 font-mono text-sm text-gray-800 dark:text-gray-200 break-all">
                                    {uuid}
                                </div>

                                {/* Botón copiar individual */}
                                <button
                                    onClick={() => handleCopySingle(uuid, index)}
                                    className={`
                                        flex-shrink-0 p-2 rounded-lg transition-all duration-200
                                        ${copiedIndex === index
                                            ? 'bg-green-500 text-white scale-110'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-green-100 dark:hover:bg-green-900 hover:text-green-600 dark:hover:text-green-400'
                                        }
                                    `}
                                    title="Copiar UUID"
                                >
                                    {copiedIndex === index ? (
                                        <MdCheckCircle className="text-lg" />
                                    ) : (
                                        <MdContentCopy className="text-lg" />
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Estadísticas */}
                    <div className="mt-6 p-4 rounded-xl bg-green-50/50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{uuids.length}</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {version === "v4" ? "v4" : "v1"}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">Versión</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">36</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">Caracteres</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">128</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">Bits</div>
                            </div>
                        </div>
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
                            Información sobre UUIDs
                        </h3>
                        <div className="space-y-3 text-sm text-blue-700 dark:text-blue-400">
                            <div className="flex gap-2">
                                <MdFingerprint className="flex-shrink-0 mt-0.5 text-lg" />
                                <div>
                                    <strong>UUID v4:</strong> Generado completamente al azar. Es el más común y recomendado para la mayoría de casos de uso.
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <MdAccessTime className="flex-shrink-0 mt-0.5 text-lg" />
                                <div>
                                    <strong>UUID v1:</strong> Basado en timestamp y datos del sistema. Útil cuando necesitas ordenamiento temporal.
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-blue-100/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30">
                                <strong>Formato:</strong> Los UUIDs tienen el formato estándar <code className="font-mono text-xs bg-blue-200 dark:bg-blue-900 px-2 py-0.5 rounded">8-4-4-4-12</code> caracteres hexadecimales (128 bits en total), garantizando unicidad global.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
