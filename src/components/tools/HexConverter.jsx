import React, { useState } from "react";

export default function HexConverter() {
    const [inputValue, setInputValue] = useState("");
    const [outputValue, setOutputValue] = useState("");

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
    };

    return (
        <div className="space-y-6">
            {/* Entrada */}
            <div className="section-container">
                <label htmlFor="hex-input" className="label-text">
                    Entrada
                </label>
                <textarea
                    id="hex-input"
                    className="textarea-field h-32"
                    placeholder="Ingresa texto para codificar o una cadena hexadecimal para decodificar..."
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
                    Codificar a Hex
                </button>
                <button
                    onClick={handleDecode}
                    className="btn-success flex-1"
                    disabled={!inputValue}
                >
                    Decodificar desde Hex
                </button>
            </div>

            {/* Salida */}
            <div className="section-container">
                <label htmlFor="hex-output" className="label-text">
                    Salida
                </label>
                <textarea
                    id="hex-output"
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
