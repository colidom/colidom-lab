import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { MdDownload, MdLink, MdWifi, MdEmail, MdPhone, MdCheck } from "react-icons/md";

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
    const [activeTemplate, setActiveTemplate] = useState(null);

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
        setActiveTemplate(template);
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

    const templates = [
        { id: "url", label: "URL/Enlace", icon: MdLink, color: "emerald" },
        { id: "wifi", label: "WiFi", icon: MdWifi, color: "emerald" },
        { id: "email", label: "Email", icon: MdEmail, color: "emerald" },
        { id: "phone", label: "Teléfono", icon: MdPhone, color: "emerald" },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Panel de Configuración */}
            <div className="space-y-6">
                {/* Sección: Contenido */}
                <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
                        <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Contenido del QR</h2>
                    </div>

                    <textarea
                        name="content"
                        placeholder="Ingresa el texto, URL o datos para el código QR..."
                        value={qrData.content}
                        onChange={handleInputChange}
                        className="w-full h-28 px-4 py-3 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 
                            focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none
                            bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700
                            shadow-inner"
                    ></textarea>
                    
                    {qrData.content && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                            <MdCheck className="text-lg" />
                            <span>{qrData.content.length} caracteres</span>
                        </div>
                    )}
                </div>

                {/* Sección: Plantillas */}
                <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
                        <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Plantillas Rápidas</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {templates.map((template) => {
                            const Icon = template.icon;
                            const isActive = activeTemplate === template.id;
                            return (
                                <button
                                    key={template.id}
                                    onClick={() => handleTemplateClick(template.id)}
                                    className={`
                                        group relative px-4 py-4 rounded-xl font-medium transition-all duration-300
                                        flex flex-col items-center gap-2
                                        ${isActive 
                                            ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 scale-[1.02]' 
                                            : 'bg-white/70 dark:bg-gray-900/70 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900 hover:shadow-md border border-gray-200 dark:border-gray-700'
                                        }
                                    `}
                                >
                                    <Icon className={`text-2xl ${isActive ? 'text-white' : 'text-emerald-500'} transition-transform group-hover:scale-110`} />
                                    <span className="text-sm">{template.label}</span>
                                    {isActive && (
                                        <div className="absolute top-2 right-2">
                                            <MdCheck className="text-white text-lg" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Configuración WiFi */}
                    {(qrData.content.startsWith("WIFI:S:") || activeTemplate === "wifi") && (
                        <div className="mt-6 p-5 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/10 backdrop-blur-sm border border-emerald-200 dark:border-emerald-800/30">
                            <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-2">
                                <MdWifi />
                                Configuración WiFi
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Nombre de red (SSID)</label>
                                    <input
                                        type="text"
                                        value={wifiSsid}
                                        onChange={(e) => setWifiSsid(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 
                                            focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all
                                            bg-white/70 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-700"
                                        placeholder="Mi_Red_WiFi"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Contraseña</label>
                                    <input
                                        type="text"
                                        value={wifiPassword}
                                        onChange={(e) => setWifiPassword(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 
                                            focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all
                                            bg-white/70 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-700"
                                        placeholder="********"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Tipo de seguridad</label>
                                    <select
                                        value={wifiSecurity}
                                        onChange={(e) => setWifiSecurity(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg text-sm text-gray-900 dark:text-white 
                                            focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all
                                            bg-white/70 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-700"
                                    >
                                        <option value="WPA">WPA/WPA2</option>
                                        <option value="WEP">WEP</option>
                                        <option value="nopass">Sin contraseña</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sección: Personalización */}
                <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
                        <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Personalización</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tamaño</label>
                            <select
                                name="size"
                                value={qrData.size}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl text-gray-900 dark:text-white 
                                    focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all
                                    bg-white/70 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-700"
                            >
                                <option value="200">Pequeño (200×200px)</option>
                                <option value="300">Mediano (300×300px)</option>
                                <option value="400">Grande (400×400px)</option>
                                <option value="500">Extra Grande (500×500px)</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color de fondo</label>
                                <div className="relative">
                                    <input
                                        type="color"
                                        name="bgColor"
                                        value={qrData.bgColor}
                                        onChange={handleInputChange}
                                        className="w-full h-12 rounded-xl cursor-pointer border-2 border-gray-200 dark:border-gray-700"
                                    />
                                    <div className="absolute inset-0 rounded-xl pointer-events-none border-2 border-gray-200 dark:border-gray-700"></div>
                                </div>
                                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 font-mono">{qrData.bgColor}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color del código</label>
                                <div className="relative">
                                    <input
                                        type="color"
                                        name="fgColor"
                                        value={qrData.fgColor}
                                        onChange={handleInputChange}
                                        className="w-full h-12 rounded-xl cursor-pointer border-2 border-gray-200 dark:border-gray-700"
                                    />
                                    <div className="absolute inset-0 rounded-xl pointer-events-none border-2 border-gray-200 dark:border-gray-700"></div>
                                </div>
                                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 font-mono">{qrData.fgColor}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Panel de Vista Previa */}
            <div className="space-y-6">
                <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 sticky top-32">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
                        <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Vista Previa</h2>
                    </div>

                    {/* Canvas del QR */}
                    <div className="flex flex-col items-center space-y-6">
                        <div className="relative p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-inner border border-gray-200 dark:border-gray-700">
                            <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg"></canvas>
                            {!qrData.content && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center p-8">
                                        <div className="text-6xl mb-3 opacity-20">📱</div>
                                        <p className="text-sm text-gray-400 dark:text-gray-500">Tu código QR aparecerá aquí</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Información del QR */}
                        {qrData.content && (
                            <div className="w-full p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Dimensiones:</span>
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{qrData.size}×{qrData.size}px</span>
                                </div>
                            </div>
                        )}

                        {/* Botones de Descarga */}
                        <div className="w-full space-y-3">
                            <button
                                onClick={() => downloadQr("png")}
                                disabled={!qrData.content}
                                className="w-full group px-6 py-4 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3
                                    bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30
                                    hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02]
                                    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
                            >
                                <MdDownload className="text-xl group-hover:animate-bounce" />
                                Descargar PNG
                            </button>
                            <button
                                onClick={() => downloadQr("svg")}
                                disabled={!qrData.content}
                                className="w-full group px-6 py-4 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3
                                    bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 border-2 border-emerald-500
                                    hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:scale-[1.02] shadow-md
                                    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                <MdDownload className="text-xl group-hover:animate-bounce" />
                                Descargar SVG
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
