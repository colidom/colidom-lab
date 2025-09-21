import { MdFormatAlignLeft, MdColorLens, MdCode } from "react-icons/md";

import JsonFormatter from "../components/JsonFormatter";
import XmlFormatter from "../components/XmlFormatter";
import Base64Converter from "../components/Base64Converter";
import HexConverter from "../components/HexConverter";
import ColorPalette from "../components/ColorPalette";

export const devTools = [
    {
        id: "json-formatter",
        label: "JSON Formatter",
        icon: MdFormatAlignLeft,
        component: JsonFormatter,
        description: "Formatea y valida JSON de forma legible.",
    },
    {
        id: "xml-formatter",
        label: "XML Formatter",
        icon: MdFormatAlignLeft,
        component: XmlFormatter,
        description: "Formatea y valida XML de forma legible.",
    },
    {
        id: "base64-converter",
        label: "Base64",
        icon: MdCode,
        component: Base64Converter,
        description: "Codifica y decodifica texto en Base64.",
    },
    {
        id: "hex-converter",
        label: "Hexadecimal",
        icon: MdCode,
        component: HexConverter,
        description: "Convierte texto a y desde formato hexadecimal.",
    },
    {
        id: "color-palette",
        label: "Color Palette",
        icon: MdColorLens,
        component: ColorPalette,
        description: "Genera paletas de colores armónicas (monocromáticas, análogas, triádicas, etc.) usando el modelo HSL.",
    },
];
