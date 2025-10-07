import React, { useState, useMemo, useRef, useEffect } from "react";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-xml-doc";
import "prismjs/themes/prism-dark.css";
import { MdContentCopy } from "react-icons/md";
import vkbeautify from "vkbeautify";
import { XMLValidator } from "fast-xml-parser";

export default function XmlFormatter() {
    const [xmlInput, setXmlInput] = useState("");
    const [error, setError] = useState(null);
    const [formattedXml, setFormattedXml] = useState("");
    const [isCopied, setIsCopied] = useState(false);
    const timeoutRef = useRef(null);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setXmlInput(value);

        if (value.trim() === "") {
            setError(null);
            setFormattedXml("");
            return;
        }

        const validationResult = XMLValidator.validate(value);

        if (validationResult !== true) {
            setFormattedXml("");
            setError(`Error de validación: ${validationResult.err.msg}`);
            return;
        }

        try {
            const formatted = vkbeautify.xml(value);
            setFormattedXml(formatted);
            setError(null);
        } catch (e) {
            setFormattedXml("");
            setError("Error inesperado al formatear: " + e.message);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(formattedXml);
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
        if (!formattedXml) return "";
        return highlight(formattedXml, languages.markup, "xml");
    }, [formattedXml]);

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-start gap-8">
                {/* Panel de entrada */}
                <div className="w-full md:w-1/2 flex flex-col">
                    <h3 className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-2">XML sin formato</h3>
                    <textarea
                        className="w-full h-80 p-4 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200
                            bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg shadow-lg text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700"
                        placeholder={`<persona><nombre>colidom</nombre><edad>33</edad><ubicacion>Tenerife</ubicacion><proyectos><proyecto>Prioreisen</proyecto><proyecto>Colidom-lab</proyecto></proyectos></persona>`}
                        value={xmlInput}
                        onChange={handleInputChange}
                    ></textarea>
                </div>
                {/* Panel de salida */}
                <div className="w-full md:w-1/2 flex flex-col">
                    <h3 className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-2">XML Formateado</h3>
                    <div
                        className="relative w-full h-80 overflow-auto border rounded-md text-sm
                        bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg shadow-lg border-gray-200 dark:border-gray-700"
                    >
                        {/* Botón de copiar superpuesto */}
                        <div className="absolute top-2 right-2 z-10">
                            <button
                                onClick={handleCopy}
                                disabled={!formattedXml}
                                className={`p-1 rounded-md transition-colors duration-200 relative
                                    ${
                                        formattedXml
                                            ? "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                            : "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                                    }`}
                                aria-label="Copiar XML"
                                title="Copiar XML"
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
                            <code className="language-xml-doc" dangerouslySetInnerHTML={{ __html: formattedCode }} />
                        </pre>
                    </div>
                </div>
            </div>
            {error && (
                <div
                    className="w-full mt-4 p-4 rounded-md border border-red-500/30 backdrop-blur-sm
                    bg-red-500/10 dark:bg-red-700/10 text-red-700 dark:text-red-300"
                >
                    <h4 className="font-semibold">Error:</h4>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
}
