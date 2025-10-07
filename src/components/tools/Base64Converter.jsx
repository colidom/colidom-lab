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
            {/* Entrada */}
            <div className="section-container">
                <label htmlFor="base64-input" className="label-text">
                    Entrada
                </label>
                <textarea
                    id="base64-input"
                    className="textarea-field h-32"
                    placeholder="Ingresa texto para codificar o una cadena Base64 para decodificar..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={handleEncode}
                    className="btn-primary flex-1"
                    disabled={!inputValue}
                >
                    Codificar a Base64
                </button>
                <button
                    onClick={handleDecode}
                    className="btn-success flex-1"
                    disabled={!inputValue}
                >
                    Decodificar desde Base64
                </button>
            </div>

            {/* Salida */}
            <div className="section-container">
                <label htmlFor="base64-output" className="label-text">
                    Salida
                </label>
                <textarea
                    id="base64-output"
                    className="textarea-field h-32"
                    placeholder="El resultado aparecerá aquí..."
                    value={outputValue}
                    readOnly
                />
            </div>

            {/* Botón limpiar */}
            <button
                onClick={clearFields}
                className="btn-danger w-full"
            >
                Limpiar
            </button>
        </div>
    );
}
