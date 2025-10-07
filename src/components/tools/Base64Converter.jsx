import React, { useState } from "react";
import { MdContentCopy } from "react-icons/md";

export default function Base64Converter() {
    const [inputValue, setInputValue] = useState("");
    const [outputValue, setOutputValue] = useState("");
    const [isCopied, setIsCopied] = useState(false);

    const handleEncode = () => {
        try {
            const encoded = btoa(encodeURIComponent(inputValue));
            setOutputValue(encoded);
        } catch (error) {
            setOutputValue("Error: No se pudo codificar la cadena.");
        }
    };

    const handleDecode = () => {
        try {
            const decoded = decodeURIComponent(atob(inputValue));
            setOutputValue(decoded);
        } catch (error) {
            setOutputValue("Error: Formato Base64 inválido.");
        }
    };

    const clearFields = () => {
        setInputValue("");
        setOutputValue("");
        setIsCopied(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(outputValue);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Entrada */}
            <div className="p-6 rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <label htmlFor="base64-input" className="block text-lg font-semibold text-purple-600 dark:text-purple-400 mb-3">
                    Entrada
                </label>
                <textarea
                    id="base64-input"
                    className="w-full h-32 p-4 rounded-lg border border-gray-300 dark:border-gray-600 
                        bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm resize-none font-mono text-sm
                        text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                    placeholder="Ingresa texto para codificar o una cadena Base64 para decodificar..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                {inputValue && (
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Caracteres: {inputValue.length}
                    </p>
                )}
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={handleEncode}
                    className="flex-1 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold 
                        rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!inputValue}
                >
                    Codificar a Base64
                </button>
                <button
                    onClick={handleDecode}
                    className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold 
                        rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!inputValue}
                >
                    Decodificar desde Base64
                </button>
            </div>

            {/* Salida */}
            <div className="p-6 rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-3">
                    <label htmlFor="base64-output" className="block text-lg font-semibold text-purple-600 dark:text-purple-400">
                        Salida
                    </label>
                    {outputValue && !outputValue.startsWith('Error') && (
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg
                                bg-purple-200/50 dark:bg-purple-800/50 hover:bg-purple-200 dark:hover:bg-purple-800
                                text-purple-800 dark:text-purple-300 transition-colors duration-200 text-sm"
                        >
                            <MdContentCopy size={16} />
                            {isCopied ? '¡Copiado!' : 'Copiar'}
                        </button>
                    )}
                </div>
                <textarea
                    id="base64-output"
                    className="w-full h-32 p-4 rounded-lg border border-gray-300 dark:border-gray-600 
                        bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm resize-none font-mono text-sm
                        text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                    placeholder="El resultado aparecerá aquí..."
                    value={outputValue}
                    readOnly
                />
                {outputValue && (
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Caracteres: {outputValue.length}
                    </p>
                )}
            </div>

            {/* Botón limpiar */}
            <button
                onClick={clearFields}
                className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold 
                    rounded-lg shadow-lg transition-all duration-200"
            >
                Limpiar
            </button>
        </div>
    );
}
