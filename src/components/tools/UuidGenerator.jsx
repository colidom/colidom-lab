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
            <div className="section-container">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="label-text">Versión UUID</label>
                        <select
                            value={version}
                            onChange={(e) => setVersion(e.target.value)}
                            className="input-field"
                        >
                            <option value="v4">UUID v4 (Random)</option>
                            <option value="v1">UUID v1 (Timestamp)</option>
                        </select>
                    </div>

                    <div>
                        <label className="label-text">Cantidad (1-100)</label>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                            className="input-field"
                        />
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                >
                    <MdRefresh size={20} />
                    Generar UUID{quantity > 1 ? 's' : ''}
                </button>
            </div>

            {/* Resultados */}
            {uuids.length > 0 && (
                <div className="section-container">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            UUIDs Generados ({uuids.length})
                        </h3>
                        <button
                            onClick={handleCopy}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <MdContentCopy size={16} />
                            {isCopied ? "¡Copiado!" : "Copiar Todos"}
                        </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto space-y-2">
                        {uuids.map((uuid, index) => (
                            <div
                                key={index}
                                className="output-container flex items-center gap-2 group hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors"
                            >
                                <span className="flex-1 code-text">
                                    {uuid}
                                </span>
                                <button
                                    onClick={() => handleCopySingle(uuid)}
                                    className="btn-icon opacity-0 group-hover:opacity-100"
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
