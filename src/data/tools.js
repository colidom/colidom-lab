import { MdQrCode, MdCode, MdLock } from "react-icons/md";

export const tools = [
    {
        id: "generador-qr",
        name: "QR Maker",
        shortDescription: "Genera códigos QR personalizados con logos y estilos únicos.",
        description:
            "Crea códigos QR personalizados con logos, colores y estilos únicos. Perfecto para enlaces, textos, WiFi, vCards y más. Descarga en alta calidad PNG/SVG.",
        features: ["Logos personalizados", "Múltiples formatos de salida", "Exportación PNG/SVG", "Soporte WiFi y vCard", "Colores personalizables"],
        icon: MdQrCode,
        colorClasses: {
            border: "border-teal-500",
            hoverBorder: "hover:border-teal-500",
            icon: "text-teal-500",
            title: "text-teal-500",
            button: "bg-teal-500 hover:bg-teal-600",
        },
    },
    {
        id: "formateador-json",
        name: "JSON Formatter",
        shortDescription: "Formatea y valida JSON de forma legible y estructurada.",
        description: "Un formateador de JSON que te permite validar, limpiar y organizar datos JSON de manera rápida y eficiente.",
        features: ["Validación de sintaxis", "Indentación personalizable", "Soporte para JSON minificado", "Visualización de errores"],
        icon: MdCode,
        colorClasses: {
            border: "border-blue-500",
            hoverBorder: "hover:border-blue-500",
            icon: "text-blue-500",
            title: "text-blue-500",
            button: "bg-blue-500 hover:bg-blue-600",
        },
    },
    {
        id: "codificador-b64",
        name: "Base64",
        shortDescription: "Codifica y decodifica texto en Base64.",
        description: "Convierte texto plano en Base64 y viceversa. Una herramienta esencial para manejar datos codificados de forma segura.",
        features: ["Codificación y decodificación", "Soporte para múltiples formatos", "Interfaz simple y rápida"],
        icon: MdLock,
        colorClasses: {
            border: "border-purple-500",
            hoverBorder: "hover:border-purple-500",
            icon: "text-purple-500",
            title: "text-purple-500",
            button: "bg-purple-500 hover:bg-purple-600",
        },
    },
];
