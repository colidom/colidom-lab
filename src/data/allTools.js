import { MdFormatAlignLeft, MdColorLens, MdQrCode, MdCode, MdFormatIndentIncrease, MdMap } from "react-icons/md";
import JsonFormatter from "../components/JsonFormatter";
import XmlFormatter from "../components/XmlFormatter";
import Base64Converter from "../components/Base64Converter";
import HexConverter from "../components/HexConverter";
import ColorPalette from "../components/ColorPalette";
import QrGenerator from "../components/QrGenerator";
import GeocodingTool from "../components/GeocodingTool";

export const categories = [
    { id: "dev-tools", label: "Dev Tools" },
    { id: "utilities", label: "Utilities" },
];

export const allTools = [
    {
        id: "json-formatter",
        category: "dev-tools",
        name: "JSON Formatter",
        shortDescription: "Formatea y valida JSON de forma legible.",
        description:
            "Formatea y valida tu código JSON para una mejor legibilidad. Una herramienta esencial para organizar y depurar datos JSON de manera rápida y eficiente.",
        features: ["Validación de sintaxis", "Indentación personalizable", "Soporte para JSON minificado", "Visualización de errores"],
        icon: MdFormatIndentIncrease,
        component: JsonFormatter,
        colorClasses: {
            border: "border-blue-500",
            hoverBorder: "hover:border-blue-500",
            icon: "text-blue-500",
            title: "text-blue-500",
            button: "bg-blue-500 hover:bg-blue-600",
        },
    },
    {
        id: "xml-formatter",
        category: "dev-tools",
        name: "XML Formatter",
        shortDescription: "Formatea y valida XML de forma legible y estructurada.",
        description: "Una herramienta de formateo de XML que te permite organizar y validar datos XML de manera rápida y sencilla.",
        features: ["Validación de sintaxis", "Indentación automática", "Limpieza de código"],
        icon: MdFormatAlignLeft,
        component: XmlFormatter,
        colorClasses: {
            border: "border-orange-500",
            hoverBorder: "hover:border-orange-500",
            icon: "text-orange-500",
            title: "text-orange-500",
            button: "bg-orange-500 hover:bg-orange-600",
        },
    },
    {
        id: "base64-converter",
        category: "dev-tools",
        name: "Base64",
        shortDescription: "Codifica y decodifica texto en Base64.",
        description: "Convierte texto plano en Base64 y viceversa. Una herramienta esencial para manejar datos codificados de forma segura.",
        features: ["Codificación y decodificación", "Interfaz simple y rápida"],
        icon: MdCode,
        component: Base64Converter,
        colorClasses: {
            border: "border-purple-500",
            hoverBorder: "hover:border-purple-500",
            icon: "text-purple-500",
            title: "text-purple-500",
            button: "bg-purple-500 hover:bg-purple-600",
        },
    },
    {
        id: "hex-converter",
        category: "dev-tools",
        name: "Hexadecimal",
        shortDescription: "Convierte texto a y desde formato hexadecimal.",
        description: "Convierte cualquier cadena de texto a su representación hexadecimal y viceversa, facilitando el trabajo con datos binarios.",
        features: ["Codificación y decodificación", "Interfaz simple y rápida"],
        icon: MdCode,
        component: HexConverter,
        colorClasses: {
            border: "border-pink-500",
            hoverBorder: "hover:border-pink-500",
            icon: "text-pink-500",
            title: "text-pink-500",
            button: "bg-pink-500 hover:bg-pink-600",
        },
    },
    {
        id: "color-palette",
        category: "dev-tools",
        name: "Color Palette",
        shortDescription: "Genera paletas de colores armónicas a partir de un color base.",
        description:
            "Una herramienta completa para generar paletas de colores armónicas (monocromáticas, análogas, triádicas, etc.) usando el modelo HSL.",
        features: ["Paletas de colores automáticas", "Modelo HSL", "Selección de color interactiva", "Códigos HEX"],
        icon: MdColorLens,
        component: ColorPalette,
        colorClasses: {
            border: "border-red-500",
            hoverBorder: "hover:border-red-500",
            icon: "text-red-500",
            title: "text-red-500",
            button: "bg-red-500 hover:bg-red-600",
        },
    },
    {
        id: "qr-generator",
        category: "utilities",
        name: "QR Generator",
        shortDescription: "Genera códigos QR personalizados.",
        description: "Crea códigos QR personalizados para enlaces, textos, WiFi, vCards y más. Descarga en alta calidad PNG y SVG.",
        features: ["Logos personalizados", "Múltiples formatos de salida", "Exportación PNG/SVG", "Soporte WiFi y vCard"],
        icon: MdQrCode,
        component: QrGenerator,
        colorClasses: {
            border: "border-teal-500",
            hoverBorder: "hover:border-teal-500",
            icon: "text-teal-500",
            title: "text-teal-500",
            button: "bg-teal-500 hover:bg-teal-600",
        },
    },
    {
        id: "geocoding-tool",
        category: "utilities",
        name: "Geocodificador Universal",
        shortDescription: "Convierte direcciones a coordenadas y viceversa.",
        description:
            "Herramienta versátil que traduce direcciones a coordenadas geográficas (latitud y longitud) y viceversa. Soporta OpenStreetMap (por defecto) y Google Maps (opcional).",
        features: ["Detección automática de entrada", "Soporte para OpenStreetMap y Google Maps", "Generación de CSV", "Conversión bidireccional"],
        icon: MdMap,
        component: GeocodingTool,
        colorClasses: {
            border: "border-indigo-500",
            hoverBorder: "hover:border-indigo-500",
            icon: "text-indigo-500",
            title: "text-indigo-500",
            button: "bg-indigo-500 hover:bg-indigo-600",
        },
    },
];
