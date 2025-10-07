import { 
    MdFormatAlignLeft, 
    MdColorLens, 
    MdQrCode, 
    MdCode, 
    MdFormatIndentIncrease, 
    MdMap,
    MdFingerprint,
    MdLock,
    MdVpnKey,
    MdToken,
    MdSchedule,
    MdTextFields
} from "react-icons/md";

// Herramientas existentes
import JsonFormatter from "../components/tools/JsonFormatter";
import XmlFormatter from "../components/tools/XmlFormatter";
import Base64Converter from "../components/tools/Base64Converter";
import HexConverter from "../components/tools/HexConverter";
import ColorPalette from "../components/tools/ColorPalette";
import QrGenerator from "../components/tools/QrGenerator";
import GeocodingTool from "../components/tools/GeocodingTool";

// Nuevas herramientas
import UuidGenerator from "../components/tools/UuidGenerator";
import HashGenerator from "../components/tools/HashGenerator";
import PasswordGenerator from "../components/tools/PasswordGenerator";
import JwtDecoder from "../components/tools/JwtDecoder";
import TimestampConverter from "../components/tools/TimestampConverter";
import RegexTester from "../components/tools/RegexTester";

export const categories = [
    { id: "dev-tools", label: "Dev Tools" },
    { id: "utilities", label: "Utilidades" },
    { id: "security", label: "Seguridad" },
];

export const allTools = [
    // ==================== DEV TOOLS ====================
    {
        id: "json-formatter",
        category: "dev-tools",
        name: "Formateador JSON",
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
        name: "Formateador XML",
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
        name: "Paleta de Color",
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
        id: "regex-tester",
        category: "dev-tools",
        name: "Regex Tester",
        shortDescription: "Prueba y valida expresiones regulares en tiempo real.",
        description: "Herramienta completa para probar expresiones regulares con visualización de coincidencias, grupos de captura y patrones comunes predefinidos.",
        features: ["Resaltado de coincidencias", "Patrones comunes", "Soporte de flags", "Detalles de grupos"],
        icon: MdTextFields,
        component: RegexTester,
        colorClasses: {
            border: "border-rose-500",
            hoverBorder: "hover:border-rose-500",
            icon: "text-rose-500",
            title: "text-rose-500",
            button: "bg-rose-500 hover:bg-rose-600",
        },
    },
    {
        id: "timestamp-converter",
        category: "dev-tools",
        name: "Timestamp Converter",
        shortDescription: "Convierte entre fechas y timestamps Unix.",
        description: "Convierte fácilmente entre fechas legibles y timestamps Unix (segundos y milisegundos). Incluye tiempo actual en vivo.",
        features: ["Bidireccional", "Múltiples formatos", "Tiempo en vivo", "ISO 8601"],
        icon: MdSchedule,
        component: TimestampConverter,
        colorClasses: {
            border: "border-teal-500",
            hoverBorder: "hover:border-teal-500",
            icon: "text-teal-500",
            title: "text-teal-500",
            button: "bg-teal-500 hover:bg-teal-600",
        },
    },

    // ==================== UTILITIES ====================
    {
        id: "qr-generator",
        category: "utilities",
        name: "Generador QR",
        shortDescription: "Genera códigos QR personalizados.",
        description: "Crea códigos QR personalizados para enlaces, textos, WiFi, vCards y más. Descarga en alta calidad PNG y SVG.",
        features: ["Logos personalizados", "Múltiples formatos de salida", "Exportación PNG/SVG", "Soporte WiFi y vCard"],
        icon: MdQrCode,
        component: QrGenerator,
        colorClasses: {
            border: "border-emerald-500",
            hoverBorder: "hover:border-emerald-500",
            icon: "text-emerald-500",
            title: "text-emerald-500",
            button: "bg-emerald-500 hover:bg-emerald-600",
        },
    },
    {
        id: "geocoding-tool",
        category: "utilities",
        name: "Geocodificador",
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
    {
        id: "uuid-generator",
        category: "utilities",
        name: "UUID Generator",
        shortDescription: "Genera identificadores únicos universales (UUID).",
        description: "Genera UUIDs v4 (aleatorios) o v1 (basados en timestamp) en cantidad. Perfectos para identificadores únicos en bases de datos y APIs.",
        features: ["UUID v4 y v1", "Generación en lote", "Copia individual o masiva", "Explicación de formatos"],
        icon: MdFingerprint,
        component: UuidGenerator,
        colorClasses: {
            border: "border-green-500",
            hoverBorder: "hover:border-green-500",
            icon: "text-green-500",
            title: "text-green-500",
            button: "bg-green-500 hover:bg-green-600",
        },
    },

    // ==================== SECURITY ====================
    {
        id: "hash-generator",
        category: "security",
        name: "Hash Generator",
        shortDescription: "Genera hashes criptográficos de texto.",
        description: "Genera hashes SHA-1, SHA-256, SHA-384 y SHA-512 de cualquier texto. Útil para verificación de integridad y checksums.",
        features: ["Múltiples algoritmos SHA", "Generación instantánea", "Comparación de longitudes", "Información sobre cada algoritmo"],
        icon: MdLock,
        component: HashGenerator,
        colorClasses: {
            border: "border-amber-500",
            hoverBorder: "hover:border-amber-500",
            icon: "text-amber-500",
            title: "text-amber-500",
            button: "bg-amber-500 hover:bg-amber-600",
        },
    },
    {
        id: "password-generator",
        category: "security",
        name: "Password Generator",
        shortDescription: "Genera contraseñas seguras y personalizables.",
        description: "Crea contraseñas fuertes con opciones personalizables. Incluye medidor de fortaleza y consejos de seguridad.",
        features: ["Longitud ajustable", "Medidor de fortaleza", "Tipos de caracteres configurables", "Generación instantánea"],
        icon: MdVpnKey,
        component: PasswordGenerator,
        colorClasses: {
            border: "border-indigo-500",
            hoverBorder: "hover:border-indigo-500",
            icon: "text-indigo-500",
            title: "text-indigo-500",
            button: "bg-indigo-500 hover:bg-indigo-600",
        },
    },
    {
        id: "jwt-decoder",
        category: "security",
        name: "JWT Decoder",
        shortDescription: "Decodifica y analiza tokens JWT.",
        description: "Decodifica tokens JWT y muestra header, payload y signature. Verifica expiración y muestra claims comunes.",
        features: ["Decodificación completa", "Verificación de expiración", "Visualización de claims", "Sin validación de firma"],
        icon: MdToken,
        component: JwtDecoder,
        colorClasses: {
            border: "border-cyan-500",
            hoverBorder: "hover:border-cyan-500",
            icon: "text-cyan-500",
            title: "text-cyan-500",
            button: "bg-cyan-500 hover:bg-cyan-600",
        },
    },
];
