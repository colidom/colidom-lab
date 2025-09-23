import React, { useState } from "react";

export default function Base64Converter() {
    const [inputValue, setInputValue] = useState("");
    const [outputValue, setOutputValue] = useState("");

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
    };

    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="base64-input" className="block text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                    Entrada
                </label>
                <textarea
                    id="base64-input"
                    className="w-full h-32 px-4 py-3 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-y
                        bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg shadow-lg border-gray-200 dark:border-gray-700"
                    placeholder="Ingresa texto para codificar o una cadena Base64 para decodificar..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                    onClick={handleEncode}
                    className="flex-1 px-6 py-3 font-semibold rounded-lg shadow-lg transition-all transform
                        bg-gradient-to-br from-blue-600 to-cyan-500 text-white
                        hover:from-blue-700 hover:to-cyan-600 hover:scale-[1.02]
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={!inputValue}
                >
                    Codificar a Base64
                </button>
                <button
                    onClick={handleDecode}
                    className="flex-1 px-6 py-3 font-semibold rounded-lg shadow-lg transition-all transform
                        bg-gradient-to-br from-green-600 to-emerald-500 text-white
                        hover:from-green-700 hover:to-emerald-600 hover:scale-[1.02]
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={!inputValue}
                >
                    Decodificar desde Base64
                </button>
            </div>

            <div>
                <label htmlFor="base64-output" className="block text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                    Salida
                </label>
                <textarea
                    id="base64-output"
                    className="w-full h-32 px-4 py-3 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-y
                        bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg shadow-lg border-gray-200 dark:border-gray-700"
                    placeholder="El resultado aparecerá aquí..."
                    value={outputValue}
                    readOnly
                />
            </div>

            <button
                onClick={clearFields}
                className="w-full px-6 py-3 font-semibold rounded-lg shadow-lg transition-all transform
                    bg-gradient-to-br from-red-600 to-orange-500 text-white
                    hover:from-red-700 hover:to-orange-600 hover:scale-[1.02]"
            >
                Limpiar
            </button>
        </div>
    );
}
