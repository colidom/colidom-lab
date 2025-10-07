import React, { useState } from "react";
import { MdContentCopy, MdRefresh } from "react-icons/md";

export default function UuidGenerator() {
    const [uuids, setUuids] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [version, setVersion] = useState("v4");
    const [isCopied, setIsCopied] = useState(false);

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
    };

    const handleCopy = () => {
        const text = uuids.join("\n");
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleCopySingle = (uuid) => {
        navigator.clipboard.writeText(uuid);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Controles */}
            <div className="flex flex-col md:flex-row gap-4 p-6 rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Versión UUID
                    </label>
                    <select
                        value={version}
                        onChange={(e) => setVersion(e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                            bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm
                            text-gray-900 dark:text-white 
                            focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                    >
                        <option value="v4">UUID v4 (Random)</option>
                        <option value="v1">UUID v1 (Timestamp)</option>
                    </select>
                </div>

                <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Cantidad (1-100)
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="100"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                            bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm
                            text-gray-900 dark:text-white 
                            focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                    />
                </div>

                <div className="flex items-end">
                    <button
                        onClick={handleGenerate}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 
                            text-white font-semibold rounded-lg shadow-lg
                            hover:from-green-600 hover:to-emerald-700 
                            transform hover:scale-105 transition-all duration-200"
                    >
                        <MdRefresh size={20} />
                        Generar
                    </button>
                </div>
            </div>

            {/* Resultados */}
            {uuids.length > 0 && (
                <div className="relative p-6 rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
                            UUIDs Generados ({uuids.length})
                        </h3>
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 
                                text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 
                                transition-colors duration-200"
                        >
                            <MdContentCopy size={16} />
                            {isCopied ? "¡Copiado!" : "Copiar Todos"}
                        </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto space-y-2 custom-scrollbar">
                        {uuids.map((uuid, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 p-3 rounded-lg bg-white/50 dark:bg-gray-700/50 
                                    hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors duration-200
                                    group"
                            >
                                <span className="flex-1 font-mono text-sm text-gray-800 dark:text-gray-200">
                                    {uuid}
                                </span>
                                <button
                                    onClick={() => handleCopySingle(uuid)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                        p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                                    title="Copiar"
                                >
                                    <MdContentCopy size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Información */}
            <div className="p-6 rounded-xl bg-blue-50/50 dark:bg-blue-900/20 backdrop-blur-sm border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">ℹ️ Información</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
                    <li><strong>UUID v4:</strong> Generado aleatoriamente, más común</li>
                    <li><strong>UUID v1:</strong> Basado en timestamp, útil para ordenamiento temporal</li>
                    <li>Los UUIDs son identificadores únicos de 128 bits</li>
                    <li>Formato estándar: 8-4-4-4-12 caracteres hexadecimales</li>
                </ul>
            </div>
        </div>
    );
}
