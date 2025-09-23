import React, { useState, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const isCoordinate = (input) => {
    // Expresión regular para detectar un par de coordenadas (latitud, longitud)
    const coordinateRegex = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/;
    return coordinateRegex.test(input.trim());
};

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse";
const GOOGLE_GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json";

export default function GeocodingTool() {
    const [rawInput, setRawInput] = useState("");
    const [googleApiKey, setGoogleApiKey] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [progress, setProgress] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    const abortControllerRef = useRef(null);

    const processInputs = async () => {
        setIsProcessing(true);
        setStatusMessage("Iniciando procesamiento...");
        setProgress(0);
        abortControllerRef.current = new AbortController();

        const lines = rawInput
            .split(";")
            .map((line) => line.trim())
            .filter((line) => line !== "");
        const total = lines.length;
        const results = [];

        try {
            for (let i = 0; i < total; i++) {
                const input = lines[i];
                let output = "Error en la conversión";

                setStatusMessage(`Procesando entrada ${i + 1} de ${total}...`);
                setProgress(((i + 1) / total) * 100);

                if (isCoordinate(input)) {
                    const [lat, lon] = input.split(",").map(Number);
                    output = await reverseGeocode(lat, lon);
                } else {
                    output = await geocode(input);
                }

                results.push({
                    input: input,
                    output: output,
                });
            }

            setStatusMessage("Procesamiento completo. Generando archivo...");
            exportToXlsx(results);
            setStatusMessage("Archivo generado con éxito.");
        } catch (error) {
            if (error.name === "AbortError") {
                setStatusMessage("Procesamiento cancelado por el usuario.");
            } else {
                setStatusMessage(`Error fatal: ${error.message}`);
            }
        } finally {
            setIsProcessing(false);
            setProgress(0);
        }
    };

    const geocode = async (address) => {
        if (googleApiKey) {
            try {
                const response = await axios.get(GOOGLE_GEOCODE_URL, {
                    params: {
                        address: address,
                        key: googleApiKey,
                    },
                    signal: abortControllerRef.current.signal,
                });
                if (response.data.results.length > 0) {
                    const loc = response.data.results[0].geometry.location;
                    return `${loc.lat}, ${loc.lng}`;
                }
            } catch (error) {
                console.error("Error en la API de Google:", error);
            }
        }
        try {
            const response = await axios.get(NOMINATIM_URL, {
                params: {
                    q: address,
                    format: "json",
                    "accept-language": "es",
                },
                signal: abortControllerRef.current.signal,
            });
            if (response.data.length > 0) {
                const loc = response.data[0];
                return `${loc.lat}, ${loc.lon}`;
            }
        } catch (error) {
            console.error("Error en la API de OSM:", error);
        }
        return "No se encontraron coordenadas";
    };

    const reverseGeocode = async (lat, lon) => {
        if (googleApiKey) {
            try {
                const response = await axios.get(GOOGLE_GEOCODE_URL, {
                    params: {
                        latlng: `${lat},${lon}`,
                        key: googleApiKey,
                    },
                    signal: abortControllerRef.current.signal,
                });
                if (response.data.results.length > 0) {
                    return response.data.results[0].formatted_address;
                }
            } catch (error) {
                console.error("Error en la API de Google:", error);
            }
        }
        try {
            const response = await axios.get(NOMINATIM_REVERSE_URL, {
                params: {
                    lat: lat,
                    lon: lon,
                    format: "json",
                    "accept-language": "es",
                },
                signal: abortControllerRef.current.signal,
            });
            if (response.data.address) {
                return response.data.display_name;
            }
        } catch (error) {
            console.error("Error en la API de OSM:", error);
        }
        return "No se encontró la dirección";
    };

    const exportToXlsx = (data) => {
        if (data.length === 0) return;

        // Generar una marca de tiempo para el nombre del archivo
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");

        const timestamp = `${year}${month}${day}_${hours}${minutes}${seconds}`;
        const fileName = `geocoding_results_${timestamp}.xlsx`;

        const worksheetData = [["Entrada", "Salida"], ...data.map((row) => [row.input, row.output])];

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Resultados");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

        saveAs(blob, fileName);
    };

    return (
        <div className="space-y-6 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700">
            <div className="space-y-4">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
                        Introduce direcciones o coordenadas (separadas por punto y coma)
                    </label>
                    <textarea
                        className="w-full h-40 px-3 py-2 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none
                            bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-500"
                        placeholder={`Ejemplos:
Calle Mayor 1, Madrid;
40.7128, -74.0060;`}
                        value={rawInput}
                        onChange={(e) => setRawInput(e.target.value)}
                    ></textarea>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">Clave de API de Google Maps (Opcional)</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
                            bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-500"
                        placeholder="Ingresa tu clave de API para usar el servicio de Google"
                        value={googleApiKey}
                        onChange={(e) => setGoogleApiKey(e.target.value)}
                    />
                </div>

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={processInputs}
                        disabled={isProcessing || !rawInput.trim()}
                        className="px-6 py-2 font-semibold rounded-lg shadow-lg transition-all transform
                                bg-gradient-to-br from-blue-600 to-cyan-500 text-white
                                hover:from-blue-700 hover:to-cyan-600 hover:scale-[1.02]
                                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isProcessing ? "Procesando..." : "Iniciar Conversión"}
                    </button>
                </div>
            </div>

            {statusMessage && (
                <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md rounded-xl p-4 shadow-inner border border-gray-200 dark:border-gray-700 text-center">
                    <p className="text-gray-700 dark:text-gray-300 font-medium">{statusMessage}</p>
                    {isProcessing && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600 mt-4">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
