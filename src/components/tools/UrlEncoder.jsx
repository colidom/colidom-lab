import React, { useState } from "react";
import { MdContentCopy, MdSwapVert } from "react-icons/md";

export default function UrlEncoder() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState("encode"); // 'encode' or 'decode'
    const [isCopied, setIsCopied] = useState(false);

    const handleProcess = () => {
        try {
            if (mode === "encode") {
                setOutput(encodeURIComponent(input));
            } else {
                setOutput(decodeURIComponent(input));
            }
        } catch (error) {
            setOutput("Error: " + error.message);
        }
    };

    const handleSwap = () => {
        setMode(mode === "encode" ? "decode" : "encode");
        setInput(output);
        setOutput("");
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setMode("encode")}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                            mode === "encode"
                                ? "bg-green-500 text-white shadow-lg"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                    >
                        Codificar
                    </button>
                    <button
                        onClick={() => setMode("decode")}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                            mode === "decode"
                                ? "bg-green-500 text-white shadow-lg"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                    >
                        Decodificar
                    </button>
                </div>
                <button
                    onClick={handleProcess}
                    className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-200"
                >
                    {mode === "encode" ? "Codificar" : "Decodificar"}
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Input */}
                <div className="w-full md:w-1/2 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
                            {mode === "encode" ? "Texto Original" : "Texto Codificado"}
                        </h3>
                        <button
                            onClick={handleSwap}
                            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            title="Intercambiar entrada/salida"
                        >
                            <MdSwapVert size={20} className="text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>
                    <textarea
                        className="w-full h-80 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200
                            bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg shadow-lg text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 font-mono text-sm"
                        placeholder={
                            mode === "encode"
                                ? "Escribe el texto o URL para codificar..."
                                : "Pega el texto codificado para decodificar..."
                        }
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>

                {/* Output */}
                <div className="w-full md:w-1/2 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
                            {mode === "encode" ? "Texto Codificado" : "Texto Decodificado"}
                        </h3>
                        <button
                            onClick={handleCopy}
                            disabled={!output}
                            className={`p-2 rounded-lg transition-all duration-200 relative ${
                                output
                                    ? "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                                    : "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                            }`}
                            title="Copiar resultado"
                        >
                            <MdContentCopy size={20} />
                            {isCopied && (
                                <span className="absolute top-1/2 right-full transform -translate-y-1/2 mr-2 px-3 py-1 bg-green-500 text-white text-xs rounded-md whitespace-nowrap">
                                    ¡Copiado!
                                </span>
                            )}
                        </button>
                    </div>
                    <div className="w-full h-80 p-4 border rounded-lg overflow-auto bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg shadow-lg border-gray-200 dark:border-gray-700">
                        <pre className="font-mono text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-all">
                            {output || "El resultado aparecerá aquí..."}
                        </pre>
                    </div>
                </div>
            </div>

            {/* Info Panel */}
            <div className="p-4 rounded-lg bg-blue-500/10 dark:bg-blue-700/10 border border-blue-500/30 backdrop-blur-sm">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">💡 Información</h4>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• <strong>Codificar:</strong> Convierte caracteres especiales en formato URL-safe</li>
                    <li>• <strong>Decodificar:</strong> Convierte el texto codificado a su forma original</li>
                    <li>• Útil para parámetros de URL, formularios web y APIs</li>
                </ul>
            </div>
        </div>
    );
}
