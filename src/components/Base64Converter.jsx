import React, { useState } from "react";

export default function Base64Converter() {
    const [inputValue, setInputValue] = useState("");
    const [outputValue, setOutputValue] = useState("");

    const handleEncode = () => {
        try {
            // btoa para codificar la cadena de texto
            const encoded = btoa(encodeURIComponent(inputValue));
            setOutputValue(encoded);
        } catch (error) {
            setOutputValue("Error: No se pudo codificar la cadena.");
        }
    };

    const handleDecode = () => {
        try {
            // atob para decodificar la cadena Base64
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
                <label htmlFor="base64-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Entrada
                </label>
                <textarea
                    id="base64-input"
                    className="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-y"
                    placeholder="Ingresa texto para codificar o una cadena Base64 para decodificar..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                    onClick={handleEncode}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!inputValue}
                >
                    Codificar a Base64
                </button>
                <button
                    onClick={handleDecode}
                    className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!inputValue}
                >
                    Decodificar desde Base64
                </button>
            </div>

            <div>
                <label htmlFor="base64-output" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Salida
                </label>
                <textarea
                    id="base64-output"
                    className="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-y"
                    placeholder="El resultado aparecerá aquí..."
                    value={outputValue}
                    readOnly
                />
            </div>

            <button
                onClick={clearFields}
                className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors"
            >
                Limpiar
            </button>
        </div>
    );
}
