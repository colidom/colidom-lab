import React, { useState } from "react";
import { MdContentCopy, MdPalette, MdCheckCircle, MdColorLens } from "react-icons/md";

function hexToHsl(hex) {
    let r = 0,
        g = 0,
        b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    }
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    return [h, s, l];
}

function hslToHex(h, s, l) {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
            .toString(16)
            .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

export default function ColorPalette() {
    const [baseColor, setBaseColor] = useState("#ff5733");
    const [copiedColor, setCopiedColor] = useState(null);
    const [selectedPalette, setSelectedPalette] = useState("monochromatic");

    const generatePalette = (type) => {
        let [h, s, l] = hexToHsl(baseColor);
        let colors = [];

        s = s * 100;
        l = l * 100;

        switch (type) {
            case "monochromatic":
                for (let i = -2; i <= 2; i++) {
                    const newL = Math.max(10, Math.min(90, l + i * 15));
                    colors.push(hslToHex(h, s, newL));
                }
                break;
            case "analogous":
                for (let i = -2; i <= 2; i++) {
                    const newH = (h + i * 30 + 360) % 360;
                    colors.push(hslToHex(newH, s, l));
                }
                break;
            case "triadic":
                const h1 = h;
                const h2 = (h + 120) % 360;
                const h3 = (h + 240) % 360;
                colors = [
                    hslToHex(h1, s, Math.max(20, l - 20)),
                    hslToHex(h1, s, l),
                    hslToHex(h2, s, l),
                    hslToHex(h3, s, l),
                    hslToHex(h1, s, Math.min(80, l + 20)),
                ];
                break;
            case "complementary":
                const hComp = (h + 180) % 360;
                colors = [
                    hslToHex(h, s, Math.max(20, l - 20)),
                    hslToHex(h, s, l),
                    baseColor,
                    hslToHex(hComp, s, l),
                    hslToHex(hComp, s, Math.max(20, l - 20)),
                ];
                break;
            default:
                break;
        }
        return colors;
    };

    const paletteTypes = [
        { id: "monochromatic", name: "Monocromática", icon: "🎨", desc: "Variaciones del mismo tono" },
        { id: "analogous", name: "Análoga", icon: "🌈", desc: "Colores vecinos en el círculo cromático" },
        { id: "triadic", name: "Triádica", icon: "🔺", desc: "Tres colores equidistantes" },
        { id: "complementary", name: "Complementaria", icon: "⚖️", desc: "Colores opuestos" },
    ];

    const handleCopyColor = (color) => {
        navigator.clipboard.writeText(color);
        setCopiedColor(color);
        setTimeout(() => setCopiedColor(null), 2000);
    };

    const currentPalette = generatePalette(selectedPalette);

    return (
        <div className="space-y-6">
            {/* Sección: Color Base */}
            <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
                    <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Color Base</h2>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Color Picker */}
                    <div className="flex-shrink-0">
                        <div className="relative group">
                            <input
                                type="color"
                                value={baseColor}
                                onChange={(e) => setBaseColor(e.target.value)}
                                className="w-32 h-32 rounded-2xl cursor-pointer border-4 border-white dark:border-gray-800 shadow-2xl
                                    transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full
                                flex items-center justify-center shadow-lg">
                                <MdColorLens className="text-white text-2xl" />
                            </div>
                        </div>
                    </div>

                    {/* Color Info */}
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                            <div 
                                className="w-16 h-16 rounded-xl shadow-lg border-2 border-white dark:border-gray-700"
                                style={{ backgroundColor: baseColor }}
                            />
                            <div>
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Código HEX</div>
                                <div className="flex items-center gap-2">
                                    <code className="text-2xl font-bold font-mono text-gray-900 dark:text-white">
                                        {baseColor.toUpperCase()}
                                    </code>
                                    <button
                                        onClick={() => handleCopyColor(baseColor)}
                                        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        {copiedColor === baseColor ? (
                                            <MdCheckCircle className="text-green-500 text-xl" />
                                        ) : (
                                            <MdContentCopy className="text-gray-500 text-xl" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Valores HSL */}
                        <div className="grid grid-cols-3 gap-3">
                            {(() => {
                                const [h, s, l] = hexToHsl(baseColor);
                                return (
                                    <>
                                        <div className="p-3 rounded-lg bg-white/70 dark:bg-gray-900/70 text-center">
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Matiz</div>
                                            <div className="text-lg font-bold text-red-600 dark:text-red-400">{Math.round(h)}°</div>
                                        </div>
                                        <div className="p-3 rounded-lg bg-white/70 dark:bg-gray-900/70 text-center">
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Saturación</div>
                                            <div className="text-lg font-bold text-red-600 dark:text-red-400">{Math.round(s * 100)}%</div>
                                        </div>
                                        <div className="p-3 rounded-lg bg-white/70 dark:bg-gray-900/70 text-center">
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Luminosidad</div>
                                            <div className="text-lg font-bold text-red-600 dark:text-red-400">{Math.round(l * 100)}%</div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección: Tipo de Paleta */}
            <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
                    <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Tipo de Paleta</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {paletteTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setSelectedPalette(type.id)}
                            className={`
                                group relative p-5 rounded-xl font-medium transition-all duration-300
                                flex flex-col items-center gap-3
                                ${selectedPalette === type.id
                                    ? 'bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30 scale-[1.02]'
                                    : 'bg-white/70 dark:bg-gray-900/70 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900 hover:shadow-md border border-gray-200 dark:border-gray-700'
                                }
                            `}
                        >
                            <span className="text-4xl">{type.icon}</span>
                            <div className="text-center">
                                <div className="font-bold text-base">{type.name}</div>
                                <div className={`text-xs mt-1 ${selectedPalette === type.id ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {type.desc}
                                </div>
                            </div>
                            {selectedPalette === type.id && (
                                <div className="absolute top-3 right-3">
                                    <MdCheckCircle className="text-white text-xl" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sección: Paleta Generada */}
            <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
                    <h2 className="text-xl font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                        <MdPalette />
                        Paleta Generada
                    </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {currentPalette.map((color, index) => (
                        <div
                            key={index}
                            className="group relative"
                        >
                            <button
                                onClick={() => handleCopyColor(color)}
                                className="w-full aspect-square rounded-2xl shadow-lg border-4 border-white dark:border-gray-800
                                    transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer relative overflow-hidden"
                                style={{ backgroundColor: color }}
                            >
                                {/* Overlay en hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300
                                    flex items-center justify-center">
                                    {copiedColor === color ? (
                                        <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-xl">
                                            <MdCheckCircle className="text-green-500 text-2xl" />
                                        </div>
                                    ) : (
                                        <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MdContentCopy className="text-gray-700 dark:text-gray-300 text-xl" />
                                        </div>
                                    )}
                                </div>
                            </button>
                            
                            {/* Código del color */}
                            <div className="mt-3 text-center">
                                <code className="text-sm font-mono font-semibold text-gray-700 dark:text-gray-300">
                                    {color.toUpperCase()}
                                </code>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sección: Información */}
            <div className="bg-gradient-to-br from-blue-50/50 to-blue-50/30 dark:from-blue-900/20 dark:to-blue-900/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-blue-200/50 dark:border-blue-800/30">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <span className="text-2xl">💡</span>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">
                            Teoría del Color
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-700 dark:text-blue-400">
                            <div>
                                <strong>🎨 Monocromática:</strong> Usa un solo color con diferentes luminosidades. Ideal para diseños minimalistas y elegantes.
                            </div>
                            <div>
                                <strong>🌈 Análoga:</strong> Colores vecinos en el círculo cromático. Crea armonía natural y relajante.
                            </div>
                            <div>
                                <strong>🔺 Triádica:</strong> Tres colores equidistantes. Ofrece vibración y contraste balanceado.
                            </div>
                            <div>
                                <strong>⚖️ Complementaria:</strong> Colores opuestos. Máximo contraste y energía visual.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
