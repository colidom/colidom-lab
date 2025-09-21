import React, { useState } from "react";

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

// Convierte HSL a Hex
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
    const [baseColor, setBaseColor] = useState("#008cff");

    const generatePalette = (type) => {
        let [h, s, l] = hexToHsl(baseColor);
        let colors = [];

        s = s * 100;
        l = l * 100;

        switch (type) {
            case "monochromatic":
                // Monocromática: Varía la luminosidad del mismo tono y saturación
                for (let i = -2; i <= 2; i++) {
                    const newL = Math.max(0, Math.min(100, l + i * 15));
                    colors.push(hslToHex(h, s, newL));
                }
                break;
            case "analogous":
                // Análoga: Colores vecinos en el círculo cromático
                for (let i = -2; i <= 2; i++) {
                    const newH = (h + i * 30 + 360) % 360;
                    colors.push(hslToHex(newH, s, l));
                }
                break;
            case "triadic":
                // Triádica: 3 colores equidistantes
                const h1 = h;
                const h2 = (h + 120) % 360;
                const h3 = (h + 240) % 360;
                colors = [hslToHex(h1, s, l), hslToHex(h2, s, l), hslToHex(h3, s, l)];
                break;
            case "complementary":
                // Complementaria: Colores opuestos
                const hComp = (h + 180) % 360;
                colors = [
                    hslToHex(h, s, Math.min(100, l + 15)),
                    hslToHex(h, s, l),
                    baseColor,
                    hslToHex(hComp, s, l),
                    hslToHex(hComp, s, Math.min(100, l + 15)),
                ];
                break;
            default:
                break;
        }
        return colors;
    };

    const palettes = {
        Monocromática: generatePalette("monochromatic"),
        Análoga: generatePalette("analogous"),
        Triádica: generatePalette("triadic"),
        Complementaria: generatePalette("complementary"),
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0 p-6 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-md">
                <label className="text-lg font-medium text-gray-700 dark:text-gray-300">Color base:</label>
                <input
                    type="color"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="w-24 h-12 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                />
                <span className="text-xl font-mono text-gray-900 dark:text-white">{baseColor.toUpperCase()}</span>
            </div>

            {Object.keys(palettes).map((paletteName) => (
                <div key={paletteName} className="p-6 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-md">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{paletteName}</h3>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {palettes[paletteName].map((color, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div
                                    className="w-20 h-20 rounded-full shadow-lg border border-gray-300 dark:border-gray-600 transition-transform hover:scale-105"
                                    style={{ backgroundColor: color }}
                                ></div>
                                <span className="mt-2 text-xs font-mono text-gray-700 dark:text-gray-300">{color.toUpperCase()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
