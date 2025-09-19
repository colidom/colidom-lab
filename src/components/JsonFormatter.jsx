import React, { useState, useMemo, useRef, useEffect } from "react";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-json";
import "prismjs/themes/prism-dark.css";
import { MdContentCopy } from "react-icons/md";

export default function JsonFormatter() {
    const [jsonInput, setJsonInput] = useState("");
    const [error, setError] = useState(null);
    const [formattedJson, setFormattedJson] = useState("");
    const [isCopied, setIsCopied] = useState(false);
    const timeoutRef = useRef(null);

    const errorMessages = {
        "Unexpected token": "Hay un carácter inesperado. Revisa la sintaxis en la posición indicada.",
        "Unexpected end of JSON input": "El JSON está incompleto. Parece que falta una llave o un corchete al final.",
        "Bad control character in string literal":
            "Hay un carácter de control inválido en un texto. Revisa si hay saltos de línea o tabulaciones extrañas.",
        "Duplicate key": "Hay una clave duplicada en un objeto JSON. Las claves deben ser únicas.",
        "Unterminated string in JSON at position": "Falta una comilla de cierre para una cadena de texto.",
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setJsonInput(value);
        if (value.trim() === "") {
            setError(null);
            setFormattedJson("");
            return;
        }
        try {
            const parsed = JSON.parse(value);
            const formatted = JSON.stringify(parsed, null, 2);
            setFormattedJson(formatted);
            setError(null);
        } catch (e) {
            setFormattedJson("");
            let translatedError = "JSON inválido. Revisa la sintaxis.";
            for (const key in errorMessages) {
                if (e.message.startsWith(key)) {
                    translatedError = errorMessages[key];
                    break;
                }
            }
            setError(translatedError + " " + e.message);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(formattedJson);
        setIsCopied(true);

        // Limpiar timeout anterior si existe
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Configurar un nuevo timeout para ocultar el popup
        timeoutRef.current = setTimeout(() => {
            setIsCopied(false);
        }, 2000); // El popup durará 2 segundos
    };

    // Limpiar el timeout cuando el componente se desmonte
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const formattedCode = useMemo(() => {
        if (!formattedJson) return "";
        return highlight(formattedJson, languages.json, "json");
    }, [formattedJson]);

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Panel de entrada */}
                <div className="w-full md:w-1/2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Entrada (JSON sin formato)</h3>
                    <textarea
                        className="w-full h-80 p-4 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Pega tu JSON aquí..."
                        value={jsonInput}
                        onChange={handleInputChange}
                    ></textarea>
                </div>
                {/* Panel de salida */}
                <div className="w-full md:w-1/2">
                    <div className="flex justify-between items-center mb-2 relative">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Salida (JSON Formateado)</h3>
                        <div className="relative">
                            <button
                                onClick={handleCopy}
                                disabled={!formattedJson}
                                className={`p-1 rounded-md transition-colors duration-200 
                                    ${
                                        formattedJson
                                            ? "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                            : "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                                    }`}
                                aria-label="Copiar JSON"
                                title="Copiar JSON"
                            >
                                <MdContentCopy size={24} />
                            </button>
                            {/* Popup de "Copiado" */}
                            {isCopied && (
                                <span className="absolute top-1/2 right-full transform -translate-y-1/2 mr-2 px-3 py-1 bg-green-500 text-white text-xs rounded-md whitespace-nowrap animate-fade-in-out">
                                    ¡Copiado!
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="relative w-full h-80 overflow-auto border rounded-md bg-gray-50 dark:bg-gray-700 text-sm">
                        <pre className="p-4">
                            <code className="language-json" dangerouslySetInnerHTML={{ __html: formattedCode }} />
                        </pre>
                    </div>
                </div>
            </div>
            {/* Mensaje de error - en la parte inferior */}
            {error && (
                <div className="w-full mt-4 p-4 rounded-md bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300">
                    <h4 className="font-semibold">Error:</h4>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
}
