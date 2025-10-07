import React, { useState } from "react";
import { MdContentCopy, MdDataObject, MdTextFields, MdCheckCircle, MdClear } from "react-icons/md";

export default function HexConverter() {
    const [inputValue, setInputValue] = useState("");
    const [outputValue, setOutputValue] = useState("");
    const [mode, setMode] = useState("encode"); // 'encode' or 'decode'
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

    const handleProcess = () => {
        if (mode === "encode") {
            handleEncode();
        } else {
            handleDecode();
        }
    };

    const isError = outputValue.startsWith("Error");

    return (
        <div className="space-y-6">
            {/* Sección: Modo de conversión */}
            <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full"></div>
                    <h2 className="text-xl font-bold text-pink-600 dark:text-pink-400">Modo de Conversión</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => setMode("encode")}
                        className={`
                            group relative px-6 py-5 rounded-xl font-medium transition-all duration-300
                            flex items-center gap-4
                            ${mode === "encode"
                                ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30 scale-[1.02]'
                                : 'bg-white/70 dark:bg-gray-900/70 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900 hover:shadow-md border border-gray-200 dark:border-gray-700'
                            }
                        `}
                    >
                        <MdDataObject className={`text-3xl ${mode === "encode" ? 'text-white' : 'text-pink-500'} transition-transform group-hover:scale-110`} />
                        <div className="flex-1 text-left">
                            <div className="font-bold text-lg">Codificar</div>
                            <div className={`text-sm ${mode === "encode" ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>
                                Texto → Hexadecimal
                            </div>
                        </div>
                        {mode === "encode" && (
                            <MdCheckCircle className="text-white text-2xl" />
                        )}
                    </button>

                    <button
                        onClick={() => setMode("decode")}
                        className={`
                            group relative px-6 py-5 rounded-xl font-medium transition-all duration-300
                            flex items-center gap-4
                            ${mode === "decode"
                                ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30 scale-[1.02]'
                                : 'bg-white/70 dark:bg-gray-900/70 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900 hover:shadow-md border border-gray-200 dark:border-gray-700'
                            }
                        `}
                    >
                        <MdTextFields className={`text-3xl ${mode === "decode" ? 'text-white' : 'text-pink-500'} transition-transform group-hover:scale-110`} />
                        <div className="flex-1 text-left">
                            <div className="font-bold text-lg">Decodificar</div>
                            <div className={`text-sm ${mode === "decode" ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>
                                Hexadecimal → Texto
                            </div>
                        </div>
                        {mode === "decode" && (
                            <MdCheckCircle className="text-white text-2xl" />
                        )}
                    </button>
                </div>
            </div>

            {/* Sección: Entrada */}
            <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full"></div>
                    <h2 className="text-xl font-bold text-pink-600 dark:text-pink-400">
                        {mode === "encode" ? "Texto Original" : "Código Hexadecimal"}
                    </h2>
                </div>

                <textarea
                    className="w-full h-40 px-4 py-3 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 
                        focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all resize-none font-mono text-sm
                        bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700
                        shadow-inner"
                    placeholder={mode === "encode" 
                        ? "Escribe el texto que deseas convertir a hexadecimal..." 
                        : "Pega el código hexadecimal (ej: 48656C6C6F)..."
                    }
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                
                {inputValue && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-pink-600 dark:text-pink-400">
                        <MdCheckCircle className="text-lg" />
                        <span>{inputValue.length} caracteres</span>
                    </div>
                )}
            </div>

            {/* Sección: Acción */}
            <div className="flex gap-3">
                <button
                    onClick={handleProcess}
                    disabled={!inputValue.trim()}
                    className="flex-1 group px-6 py-4 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3
                        bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30
                        hover:from-pink-600 hover:to-rose-600 hover:shadow-xl hover:shadow-pink-500/40 hover:scale-[1.02]
                        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
                >
                    {mode === "encode" ? <MdDataObject className="text-xl" /> : <MdTextFields className="text-xl" />}
                    {mode === "encode" ? "Convertir a Hexadecimal" : "Decodificar a Texto"}
                </button>
                
                {(inputValue || outputValue) && (
                    <button
                        onClick={clearFields}
                        className="px-6 py-4 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2
                            bg-white dark:bg-gray-900 text-red-600 dark:text-red-400 border-2 border-red-500
                            hover:bg-red-50 dark:hover:bg-red-950 hover:scale-105 shadow-md"
                    >
                        <MdClear className="text-xl" />
                        Limpiar
                    </button>
                )}
            </div>

            {/* Sección: Resultado */}
            {outputValue && (
                <div className={`bg-gradient-to-br backdrop-blur-xl rounded-2xl p-6 shadow-lg border animate-slide-in
                    ${isError 
                        ? 'from-red-50/50 to-red-50/30 dark:from-red-900/20 dark:to-red-900/10 border-red-200/50 dark:border-red-800/30'
                        : 'from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 border-gray-200/50 dark:border-gray-700/50'
                    }`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-1 h-8 rounded-full ${isError ? 'bg-red-500' : 'bg-gradient-to-b from-pink-500 to-rose-500'}`}></div>
                            <h2 className={`text-xl font-bold ${isError ? 'text-red-600 dark:text-red-400' : 'text-pink-600 dark:text-pink-400'}`}>
                                {isError ? "Error" : mode === "encode" ? "Hexadecimal" : "Texto Decodificado"}
                            </h2>
                        </div>
                        
                        {!isError && (
                            <button
                                onClick={handleCopy}
                                className="group px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2
                                    bg-white dark:bg-gray-900 text-pink-600 dark:text-pink-400 border-2 border-pink-500
                                    hover:bg-pink-50 dark:hover:bg-pink-950 hover:scale-105 shadow-md"
                            >
                                <MdContentCopy className="text-lg" />
                                {isCopied ? "¡Copiado!" : "Copiar"}
                            </button>
                        )}
                    </div>

                    <div className={`p-4 rounded-xl ${isError ? 'bg-red-100 dark:bg-red-900/30' : 'bg-white/70 dark:bg-gray-900/70'} 
                        backdrop-blur-sm border ${isError ? 'border-red-300 dark:border-red-800' : 'border-gray-200 dark:border-gray-700'}`}
                    >
                        <pre className={`font-mono text-sm break-all whitespace-pre-wrap ${isError ? 'text-red-700 dark:text-red-300' : 'text-gray-800 dark:text-gray-200'}`}>
                            {outputValue}
                        </pre>
                    </div>

                    {!isError && (
                        <div className="mt-3 text-sm text-pink-600 dark:text-pink-400">
                            {outputValue.length} caracteres {mode === "encode" && `(${outputValue.length / 2} bytes)`}
                        </div>
                    )}
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
                            Sobre Hexadecimal
                        </h3>
                        <div className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
                            <p>
                                <strong>Hexadecimal</strong> es un sistema numérico en base 16 que usa los dígitos 0-9 y las letras A-F.
                            </p>
                            <p>
                                <strong>Usos comunes:</strong> Representación de colores (#FF5733), direcciones de memoria, códigos de caracteres, y depuración de datos binarios.
                            </p>
                            <p>
                                Cada carácter se representa con 2 dígitos hexadecimales (1 byte = 8 bits).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
