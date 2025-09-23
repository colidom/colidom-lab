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
    const [wifiSsid, setWifiSsid] = useState("");
    const [wifiPassword, setWifiPassword] = useState("");
    const [wifiSecurity, setWifiSecurity] = useState("WPA");

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setQrData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTemplateClick = (template) => {
        let newContent = "";
        switch (template) {
            case "url":
                newContent = "https://colidom.dev";
                setWifiSsid("");
                setWifiPassword("");
                setWifiSecurity("WPA");
                break;
            case "wifi":
                newContent = `WIFI:S:${wifiSsid};T:${wifiSecurity};P:${wifiPassword};;`;
                break;
            case "email":
                newContent = "mailto:colidom@outlook.com";
                setWifiSsid("");
                setWifiPassword("");
                setWifiSecurity("WPA");
                break;
            case "phone":
                newContent = "tel:+34123456789";
                setWifiSsid("");
                setWifiPassword("");
                setWifiSecurity("WPA");
                break;
            default:
                newContent = "";
                setWifiSsid("");
                setWifiPassword("");
                setWifiSecurity("WPA");
        }
        setQrData((prev) => ({ ...prev, content: newContent }));
    };

    useEffect(() => {
        if (qrData.content.startsWith("WIFI:S:")) {
            setQrData((prev) => ({
                ...prev,
                content: `WIFI:S:${wifiSsid};T:${wifiSecurity};P:${wifiPassword};;`,
            }));
        }
    }, [wifiSsid, wifiPassword, wifiSecurity, qrData.content]);

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
            <div className="space-y-6 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">Configuración</h2>

                {/* Contenido del QR */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contenido del QR</label>
                    <textarea
                        name="content"
                        placeholder="Ingresa el texto, URL o datos para el código QR..."
                        value={qrData.content}
                        onChange={handleInputChange}
                        className="w-full h-24 px-3 py-2 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none
                            bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-500"
                    ></textarea>
                </div>

                {/* Plantillas rápidas */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Plantillas rápidas</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => handleTemplateClick("url")}
                            className="p-3 text-sm font-semibold rounded-lg shadow-lg transition-all transform
                                bg-gradient-to-br from-blue-600 to-cyan-500 text-white
                                hover:from-blue-700 hover:to-cyan-600 hover:scale-[1.02]"
                        >
                            🌐 URL/Enlace
                        </button>
                        <button
                            onClick={() => handleTemplateClick("wifi")}
                            className="p-3 text-sm font-semibold rounded-lg shadow-lg transition-all transform
                                bg-gradient-to-br from-green-600 to-emerald-500 text-white
                                hover:from-green-700 hover:to-emerald-600 hover:scale-[1.02]"
                        >
                            📶 WiFi
                        </button>
                        <button
                            onClick={() => handleTemplateClick("email")}
                            className="p-3 text-sm font-semibold rounded-lg shadow-lg transition-all transform
                                bg-gradient-to-br from-purple-600 to-fuchsia-500 text-white
                                hover:from-purple-700 hover:to-fuchsia-600 hover:scale-[1.02]"
                        >
                            📧 Email
                        </button>
                        <button
                            onClick={() => handleTemplateClick("phone")}
                            className="p-3 text-sm font-semibold rounded-lg shadow-lg transition-all transform
                                bg-gradient-to-br from-orange-600 to-yellow-500 text-white
                                hover:from-orange-700 hover:to-yellow-600 hover:scale-[1.02]"
                        >
                            📱 Teléfono
                        </button>
                    </div>

                    {(qrData.content.startsWith("WIFI:S:") || wifiSsid || wifiPassword) && (
                        <div className="mt-4 p-4 rounded-lg bg-white/30 dark:bg-gray-800/30 backdrop-blur-md shadow-inner border border-gray-200 dark:border-gray-700">
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre de red (SSID)</label>
                                <input
                                    type="text"
                                    value={wifiSsid}
                                    onChange={(e) => setWifiSsid(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
                                        bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-500"
                                    placeholder="Nombre de la red Wifi"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
                                <input
                                    type="text"
                                    value={wifiPassword}
                                    onChange={(e) => setWifiPassword(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
                                        bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-500"
                                    placeholder="Contraseña de la red Wifi"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Seguridad</label>
                                <select
                                    value={wifiSecurity}
                                    onChange={(e) => setWifiSecurity(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
                                        bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-500"
                                >
                                    <option value="WPA">WPA/WPA2</option>
                                    <option value="WEP">WEP</option>
                                    <option value="nopass">Sin contraseña</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Opciones de diseño */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">Opciones de Estilo</h3>
                    {/* Contenedor Flexbox para vista de escritorio */}
                    <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tamaño</label>
                            <select
                                name="size"
                                value={qrData.size}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
                                    bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-500"
                            >
                                <option value="200">Pequeño (200x200)</option>
                                <option value="300">Mediano (300x300)</option>
                                <option value="400">Grande (400x400)</option>
                                <option value="500">Extra Grande (500x500)</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color de fondo</label>
                            <input
                                type="color"
                                name="bgColor"
                                value={qrData.bgColor}
                                onChange={handleInputChange}
                                className="w-full h-10 border border-gray-300 dark:border-gray-500 rounded-lg cursor-pointer bg-white/50 dark:bg-gray-700/50"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color del código</label>
                            <input
                                type="color"
                                name="fgColor"
                                value={qrData.fgColor}
                                onChange={handleInputChange}
                                className="w-full h-10 border border-gray-300 dark:border-gray-500 rounded-lg cursor-pointer bg-white/50 dark:bg-gray-700/50"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Panel de Vista Previa y Descarga */}
            <div className="space-y-6 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">Vista previa y descarga</h2>

                {/* Área de Visualización */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-white dark:bg-gray-600 rounded-lg shadow-inner">
                        <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg"></canvas>
                    </div>

                    {/* Botones de Descarga */}
                    <div className="flex space-x-3">
                        <button
                            onClick={() => downloadQr("png")}
                            disabled={!qrData.content}
                            className="px-4 py-2 font-semibold rounded-lg shadow-lg transition-all transform
                                bg-gradient-to-br from-blue-600 to-cyan-500 text-white
                                hover:from-blue-700 hover:to-cyan-600 hover:scale-[1.02]
                                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            <MdDownload className="w-4 h-4 inline mr-2" /> PNG
                        </button>
                        <button
                            onClick={() => downloadQr("svg")}
                            disabled={!qrData.content}
                            className="px-4 py-2 font-semibold rounded-lg shadow-lg transition-all transform
                                bg-gradient-to-br from-purple-600 to-fuchsia-500 text-white
                                hover:from-purple-700 hover:to-fuchsia-600 hover:scale-[1.02]
                                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
    );
}
