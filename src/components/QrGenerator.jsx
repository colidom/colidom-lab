import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { MdDownload } from "react-icons/md";

const initialData = {
    content: "",
    size: 300,
    bgColor: "#ffffff",
    fgColor: "#000000",
};

export default function QrGenerator() {
    const [qrData, setQrData] = useState(initialData);
    const canvasRef = useRef(null);

    // Generar el código QR cada vez que los datos cambian
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        if (qrData.content) {
            QRCode.toCanvas(
                canvas,
                qrData.content,
                {
                    width: qrData.size,
                    color: {
                        dark: qrData.fgColor,
                        light: qrData.bgColor,
                    },
                },
                (error) => {
                    if (error) console.error(error);
                }
            );
        } else {
            const context = canvas.getContext("2d");
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    }, [qrData]);

    // Manejadores para los campos de entrada
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setQrData((prev) => ({ ...prev, [name]: value }));
    };

    // Manejador para las plantillas rápidas
    const handleTemplateClick = (template) => {
        let newContent = "";
        switch (template) {
            case "url":
                newContent = "https://colidom.dev";
                break;
            case "wifi":
                newContent = "WIFI:S:MyNetwork;T:WPA;P:MyPassword;;";
                break;
            case "email":
                newContent = "mailto:colidom@outlook.com";
                break;
            case "phone":
                newContent = "tel:+34123456789";
                break;
            default:
                newContent = "";
        }
        setQrData((prev) => ({ ...prev, content: newContent }));
    };

    const downloadQr = (format) => {
        if (!qrData.content) return;
        const canvas = canvasRef.current;
        let url;
        if (format === "png") {
            url = canvas.toDataURL("image/png");
        } else if (format === "svg") {
            QRCode.toDataURL(
                qrData.content,
                {
                    type: "image/svg",
                    color: {
                        dark: qrData.fgColor,
                        light: qrData.bgColor,
                    },
                },
                (err, url) => {
                    if (err) throw err;
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `qrcode.${format}`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            );
            return;
        }

        const link = document.createElement("a");
        link.href = url;
        link.download = `qrcode.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Panel de Configuración */}
            <div className="space-y-6">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6 shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Configuración</h2>

                    {/* Contenido del QR */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contenido del QR</label>
                        <textarea
                            name="content"
                            placeholder="Ingresa el texto, URL o datos para el código QR..."
                            value={qrData.content}
                            onChange={handleInputChange}
                            className="w-full h-24 px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        ></textarea>
                    </div>

                    {/* Plantillas rápidas */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Plantillas rápidas</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => handleTemplateClick("url")}
                                className="p-2 text-sm bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                            >
                                🌐 URL/Enlace
                            </button>
                            <button
                                onClick={() => handleTemplateClick("wifi")}
                                className="p-2 text-sm bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                            >
                                📶 WiFi
                            </button>
                            <button
                                onClick={() => handleTemplateClick("email")}
                                className="p-2 text-sm bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                            >
                                📧 Email
                            </button>
                            <button
                                onClick={() => handleTemplateClick("phone")}
                                className="p-2 text-sm bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                            >
                                📱 Teléfono
                            </button>
                        </div>
                    </div>

                    {/* Opciones de diseño */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tamaño</label>
                            <select
                                name="size"
                                value={qrData.size}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="200">Pequeño (200x200)</option>
                                <option value="300">Mediano (300x300)</option>
                                <option value="400">Grande (400x400)</option>
                                <option value="500">Extra Grande (500x500)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color de fondo</label>
                            <input
                                type="color"
                                name="bgColor"
                                value={qrData.bgColor}
                                onChange={handleInputChange}
                                className="w-full h-10 border border-gray-300 dark:border-gray-500 rounded-lg cursor-pointer bg-white dark:bg-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color del código</label>
                            <input
                                type="color"
                                name="fgColor"
                                value={qrData.fgColor}
                                onChange={handleInputChange}
                                className="w-full h-10 border border-gray-300 dark:border-gray-500 rounded-lg cursor-pointer bg-white dark:bg-gray-600"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Panel de Vista Previa y Descarga */}
            <div className="space-y-6">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6 shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Vista previa y descarga</h2>

                    {/* Área de Visualización */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="p-4 bg-white dark:bg-gray-600 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-500">
                            <canvas ref={canvasRef} className="max-w-full h-auto"></canvas>
                        </div>

                        {/* Botones de Descarga */}
                        <div className="flex space-x-3">
                            <button
                                onClick={() => downloadQr("png")}
                                disabled={!qrData.content}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <MdDownload className="w-4 h-4 inline mr-2" /> PNG
                            </button>
                            <button
                                onClick={() => downloadQr("svg")}
                                disabled={!qrData.content}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <MdDownload className="w-4 h-4 inline mr-2" /> SVG
                            </button>
                        </div>

                        {/* Indicadores */}
                        {qrData.content && (
                            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                                <p>
                                    Tamaño: {qrData.size}x{qrData.size}px
                                </p>
                                <p>Caracteres: {qrData.content.length}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
