import React, { useState, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { MdLocationOn, MdMyLocation, MdDownload, MdCancel, MdCheckCircle, MdVpnKey, MdMap } from "react-icons/md";

const isCoordinate = (input) => {
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
    const [inputType, setInputType] = useState("address"); // 'address' or 'coordinates'

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

                // Pequeña pausa para respetar límites de API
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            setStatusMessage("Procesamiento completo. Generando archivo...");
            exportToXlsx(results);
            setStatusMessage("¡Archivo generado con éxito!");
        } catch (error) {
            if (error.name === "AbortError") {
                setStatusMessage("Procesamiento cancelado por el usuario.");
            } else {
                setStatusMessage(`Error: ${error.message}`);
            }
        } finally {
            setIsProcessing(false);
            setProgress(0);
        }
    };

    const cancelProcessing = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
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

        const now = new Date();
        const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const fileName = `geocoding_results_${timestamp}.xlsx`;

        const worksheetData = [["Entrada", "Salida"], ...data.map((row) => [row.input, row.output])];

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Resultados");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

        saveAs(blob, fileName);
    };

    const loadExample = (type) => {
        setInputType(type);
        if (type === "address") {
            setRawInput("Calle Gran Vía 1, Madrid, España;\nPlaza Mayor, Salamanca, España;\nRambla de Catalunya 100, Barcelona");
        } else {
            setRawInput("40.4168, -3.7038;\n40.9701, -5.6635;\n41.3874, 2.1686");
        }
    };

    return (
        <div className="space-y-6">
            {/* Sección: Tipo de conversión */}
            <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
                    <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Tipo de Conversión</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => loadExample("address")}
                        className={`
                            group relative px-6 py-5 rounded-xl font-medium transition-all duration-300
                            flex items-center gap-4
                            ${inputType === "address"
                                ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]'
                                : 'bg-white/70 dark:bg-gray-900/70 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900 hover:shadow-md border border-gray-200 dark:border-gray-700'
                            }
                        `}
                    >
                        <MdLocationOn className={`text-3xl ${inputType === "address" ? 'text-white' : 'text-indigo-500'} transition-transform group-hover:scale-110`} />
                        <div className="flex-1 text-left">
                            <div className="font-bold text-lg">Dirección → Coordenadas</div>
                            <div className={`text-sm ${inputType === "address" ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>
                                Convierte direcciones a lat/lng
                            </div>
                        </div>
                        {inputType === "address" && (
                            <MdCheckCircle className="text-white text-2xl" />
                        )}
                    </button>

                    <button
                        onClick={() => loadExample("coordinates")}
                        className={`
                            group relative px-6 py-5 rounded-xl font-medium transition-all duration-300
                            flex items-center gap-4
                            ${inputType === "coordinates"
                                ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]'
                                : 'bg-white/70 dark:bg-gray-900/70 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900 hover:shadow-md border border-gray-200 dark:border-gray-700'
                            }
                        `}
                    >
                        <MdMyLocation className={`text-3xl ${inputType === "coordinates" ? 'text-white' : 'text-indigo-500'} transition-transform group-hover:scale-110`} />
                        <div className="flex-1 text-left">
                            <div className="font-bold text-lg">Coordenadas → Dirección</div>
                            <div className={`text-sm ${inputType === "coordinates" ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>
                                Convierte lat/lng a direcciones
                            </div>
                        </div>
                        {inputType === "coordinates" && (
                            <MdCheckCircle className="text-white text-2xl" />
                        )}
                    </button>
                </div>
            </div>

            {/* Sección: Entrada de datos */}
            <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
                    <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Datos de Entrada</h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {inputType === "address" ? "Direcciones" : "Coordenadas"} (separadas por punto y coma o salto de línea)
                            </label>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {rawInput.split(/[;\n]/).filter(l => l.trim()).length} entradas
                            </span>
                        </div>
                        <textarea
                            className="w-full h-48 px-4 py-3 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 
                                focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none font-mono text-sm
                                bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700
                                shadow-inner"
                            placeholder={inputType === "address" 
                                ? "Calle Mayor 1, Madrid;\nGran Vía 50, Barcelona;\nAvenida Libertad 100, Valencia"
                                : "40.4168, -3.7038;\n41.3874, 2.1686;\n39.4699, -0.3763"
                            }
                            value={rawInput}
                            onChange={(e) => setRawInput(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-800/30">
                        <div className="flex items-start gap-3">
                            <MdMap className="text-indigo-600 dark:text-indigo-400 text-xl flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-indigo-700 dark:text-indigo-300">
                                <strong>Formatos aceptados:</strong>
                                <ul className="mt-1 space-y-0.5 list-disc list-inside">
                                    {inputType === "address" ? (
                                        <>
                                            <li>Direcciones completas con ciudad y país</li>
                                            <li>Separa múltiples entradas con ";" o saltos de línea</li>
                                        </>
                                    ) : (
                                        <>
                                            <li>Formato: latitud, longitud (ej: 40.4168, -3.7038)</li>
                                            <li>Separa múltiples coordenadas con ";" o saltos de línea</li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección: Configuración opcional */}
            <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
                    <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Configuración Opcional</h2>
                </div>

                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <MdVpnKey className="text-indigo-500 text-xl flex-shrink-0 mt-3" />
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                API Key de Google Maps (Opcional)
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 
                                    focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono text-sm
                                    bg-white/70 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-700"
                                placeholder="AIza...your-api-key-here"
                                value={googleApiKey}
                                onChange={(e) => setGoogleApiKey(e.target.value)}
                            />
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                Si no proporcionas una clave, se usará OpenStreetMap (gratuito, con límite de uso)
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección: Acciones */}
            <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex flex-col sm:flex-row gap-3">
                    {!isProcessing ? (
                        <button
                            onClick={processInputs}
                            disabled={!rawInput.trim()}
                            className="flex-1 group px-6 py-4 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3
                                bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30
                                hover:from-indigo-600 hover:to-purple-600 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02]
                                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
                        >
                            <MdDownload className="text-xl group-hover:animate-bounce" />
                            Iniciar Conversión y Descargar Excel
                        </button>
                    ) : (
                        <button
                            onClick={cancelProcessing}
                            className="flex-1 group px-6 py-4 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3
                                bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30
                                hover:from-red-600 hover:to-orange-600 hover:shadow-xl hover:shadow-red-500/40 hover:scale-[1.02]"
                        >
                            <MdCancel className="text-xl" />
                            Cancelar Proceso
                        </button>
                    )}
                </div>
            </div>

            {/* Sección: Estado del proceso */}
            {statusMessage && (
                <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-start gap-4">
                        {isProcessing ? (
                            <div className="animate-spin">
                                <MdMyLocation className="text-2xl text-indigo-500" />
                            </div>
                        ) : statusMessage.includes("éxito") ? (
                            <MdCheckCircle className="text-2xl text-green-500" />
                        ) : (
                            <MdMap className="text-2xl text-indigo-500" />
                        )}
                        <div className="flex-1">
                            <p className="text-gray-700 dark:text-gray-300 font-medium">{statusMessage}</p>
                            {isProcessing && progress > 0 && (
                                <div className="mt-4">
                                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        <span>Progreso</span>
                                        <span>{Math.round(progress)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
                                        <div
                                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                                            style={{ width: `${progress}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
