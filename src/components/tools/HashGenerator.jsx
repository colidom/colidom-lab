import React, { useState, useEffect } from "react";
import { MdContentCopy } from "react-icons/md";

export default function HashGenerator() {
    const [input, setInput] = useState("");
    const [hashes, setHashes] = useState({});
    const [copiedHash, setCopiedHash] = useState("");

    const generateSHA = async (str, algorithm) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest(algorithm, data);
        return Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    };

    useEffect(() => {
        if (!input.trim()) {
            setHashes({});
            return;
        }

        const generateHashes = async () => {
            const newHashes = {
                'SHA-1': await generateSHA(input, 'SHA-1'),
                'SHA-256': await generateSHA(input, 'SHA-256'),
                'SHA-384': await generateSHA(input, 'SHA-384'),
                'SHA-512': await generateSHA(input, 'SHA-512'),
            };
            setHashes(newHashes);
        };

        generateHashes();
    }, [input]);

    const handleCopy = (hashType, hashValue) => {
        navigator.clipboard.writeText(hashValue);
        setCopiedHash(hashType);
        setTimeout(() => setCopiedHash(""), 2000);
    };

    const hashColors = {
        'SHA-1': 'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/20',
        'SHA-256': 'border-green-500 bg-green-50/50 dark:bg-green-900/20',
        'SHA-384': 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20',
        'SHA-512': 'border-purple-500 bg-purple-50/50 dark:bg-purple-900/20',
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Input */}
            <div className="p-6 rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <label className="block text-lg font-semibold text-amber-600 dark:text-amber-400 mb-3">
                    Texto a Hashear
                </label>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escribe o pega tu texto aquí..."
                    className="w-full h-32 p-4 rounded-lg border border-gray-300 dark:border-gray-600 
                        bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm resize-none
                        text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200"
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Caracteres: {input.length}
                </p>
            </div>

            {/* Hashes */}
            {Object.keys(hashes).length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Hashes Generados
                    </h3>
                    
                    {Object.entries(hashes).map(([type, hash]) => (
                        <div
                            key={type}
                            className={`p-5 rounded-xl backdrop-blur-sm shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${hashColors[type]}`}
                        >
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                    {type}
                                </h4>
                                <button
                                    onClick={() => handleCopy(type, hash)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg
                                        bg-white/50 dark:bg-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-700/70
                                        text-gray-700 dark:text-gray-300 transition-colors duration-200"
                                >
                                    <MdContentCopy size={16} />
                                    {copiedHash === type ? "¡Copiado!" : "Copiar"}
                                </button>
                            </div>
                            <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                                <code className="text-sm font-mono text-gray-800 dark:text-gray-200 break-all">
                                    {hash}
                                </code>
                            </div>
                            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                Longitud: {hash.length} caracteres
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Información */}
            <div className="p-6 rounded-xl bg-blue-50/50 dark:bg-blue-900/20 backdrop-blur-sm border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">ℹ️ Sobre los Hashes</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-400">
                    <div>
                        <strong>SHA-1:</strong>
                        <p className="text-xs mt-1">160 bits (40 caracteres hex). Obsoleto para seguridad crítica.</p>
                    </div>
                    <div>
                        <strong>SHA-256:</strong>
                        <p className="text-xs mt-1">256 bits (64 caracteres hex). Estándar actual más usado.</p>
                    </div>
                    <div>
                        <strong>SHA-384:</strong>
                        <p className="text-xs mt-1">384 bits (96 caracteres hex). Mayor seguridad.</p>
                    </div>
                    <div>
                        <strong>SHA-512:</strong>
                        <p className="text-xs mt-1">512 bits (128 caracteres hex). Máxima seguridad SHA-2.</p>
                    </div>
                </div>
                <p className="mt-3 text-xs text-blue-600 dark:text-blue-400">
                    <strong>Nota:</strong> Los hashes son unidireccionales y no pueden ser revertidos. Se usan para verificar integridad de datos.
                </p>
            </div>
        </div>
    );
}
