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
            setError("JSON inválido. Revisa la sintaxis. " + e.message);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(formattedJson);
        setIsCopied(true);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

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
            <div className="flex flex-col md:flex-row md:items-start gap-8">
                {/* Panel de entrada */}
                <div className="w-full md:w-1/2 flex flex-col">
                    <h3 className="text-l font-semibold text-gray-900 dark:text-white mb-2">JSON sin formato</h3>
                    <textarea
                        className="w-full h-80 p-4 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder={`{"name": "colidom",  "age": 33, "location": "Tenerife", "projects": ["Prioreisen", "Colidom-lab", "React Portfolio Template"]}`}
                        value={jsonInput}
                        onChange={handleInputChange}
                    ></textarea>
                </div>
                {/* Panel de salida */}
                <div className="w-full md:w-1/2 flex flex-col">
                    <h3 className="text-l font-semibold text-gray-900 dark:text-white mb-2">JSON Formateado</h3>
                    <div className="relative w-full h-80 overflow-auto border rounded-md bg-gray-50 dark:bg-gray-700 text-sm">
                        <div className="absolute top-2 right-2 z-10">
                            <button
                                onClick={handleCopy}
                                disabled={!formattedJson}
                                className={`p-1 rounded-md transition-colors duration-200 relative
                                    ${
                                        formattedJson
                                            ? "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                            : "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                                    }`}
                                aria-label="Copiar JSON"
                                title="Copiar JSON"
                            >
                                <MdContentCopy size={20} />
                                {isCopied && (
                                    <span className="absolute top-1/2 right-full transform -translate-y-1/2 mr-2 px-3 py-1 bg-green-500 text-white text-xs rounded-md whitespace-nowrap animate-fade-in-out">
                                        ¡Copiado!
                                    </span>
                                )}
                            </button>
                        </div>
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
