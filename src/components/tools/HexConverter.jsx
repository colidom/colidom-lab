import React, { useState } from "react";
import { MdContentCopy } from "react-icons/md";

export default function HexConverter() {
    const [inputValue, setInputValue] = useState("");
    const [outputValue, setOutputValue] = useState("");
    const [isCopied, setIsCopied] = useState(false);

    const handleEncode = () => {
        const hex = inputValue
            .split("")
            .map((char) => {
                const hexValue = char.charCodeAt(0).toString(16);
                return hexValue.length === 1 ? "0" + hexValue : hexValue;
            })
            .join("");
        setOutputValue(hex.toUpperCase());
    };

    const handleDecode = () => {
        try {
            const hexes = inputValue.match(/.{1,2}/g) || [];
            const decoded = hexes.map((hex) => String.fromCharCode(parseInt(hex, 16))).join("");
            setOutputValue(decoded);
        } catch (error) {
            setOutputValue("Error: Formato hexadecimal inválido.");
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
                <label htmlFor="hex-input" className="block text-lg font-semibold text-pink-600 dark:text-pink-400 mb-3">
                    Entrada
                </label>
                <textarea
                    id="hex-input"
                    className="w-full h-32 p-4 rounded-lg border border-gray-300 dark:border-gray-600 
                        bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm resize-none font-mono text-sm
                        text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200"
                    placeholder="Ingresa texto para codificar o una cadena hexadecimal para decodificar..."
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
                    className="flex-1 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold 
                        rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!inputValue}
                >
                    Codificar a Hex
                </button>
                <button
                    onClick={handleDecode}
                    className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold 
                        rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!inputValue}
                >
                    Decodificar desde Hex
                </button>
            </div>

            {/* Salida */}
            <div className="p-6 rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-3">
                    <label htmlFor="hex-output" className="block text-lg font-semibold text-pink-600 dark:text-pink-400">
                        Salida
                    </label>
                    {outputValue && !outputValue.startsWith('Error') && (
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg
                                bg-pink-200/50 dark:bg-pink-800/50 hover:bg-pink-200 dark:hover:bg-pink-800
                                text-pink-800 dark:text-pink-300 transition-colors duration-200 text-sm"
                        >
                            <MdContentCopy size={16} />
                            {isCopied ? '¡Copiado!' : 'Copiar'}
                        </button>
                    )}
                </div>
                <textarea
                    id="hex-output"
                    className="w-full h-32 p-4 rounded-lg border border-gray-300 dark:border-gray-600 
                        bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm resize-none font-mono text-sm
                        text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200"
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
