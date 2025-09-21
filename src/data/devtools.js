import React from "react";
import { MdFormatAlignLeft, MdColorLens, MdQrCode, MdCode } from "react-icons/md";

import JsonFormatter from "../components/JsonFormatter";
import XmlFormatter from "../components/XmlFormatter";

import Base64Converter from "../components/Base64Converter";
import QrGenerator from "../components/QrGenerator";

const ColorPalette = () => <div>Componente para la Paleta de Colores</div>;

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
        id: "color-palette",
        label: "Color Palette",
        icon: MdColorLens,
        component: ColorPalette,
        description: "Herramienta para seleccionar y generar paletas de colores.",
    },
];
