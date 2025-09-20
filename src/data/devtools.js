import React from "react";
import { MdFormatAlignLeft, MdColorLens, MdLock, MdQrCode } from "react-icons/md";

import JsonFormatter from "../components/JsonFormatter";
import XmlFormatter from "../components/XmlFormatter";
const ColorPalette = () => <div>Componente para la Paleta de Colores</div>;
const Base64Converter = () => <div>Componente para el Codificador/Decodificador Base64</div>;
const QrGenerator = () => <div>Componente para el Generador de QR</div>;

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
        icon: MdLock,
        component: Base64Converter,
        description: "Codifica y decodifica texto en Base64.",
    },
    /*     {
        id: "qr-generator",
        label: "QR Generator",
        icon: MdQrCode,
        component: QrGenerator,
        description: "Genera códigos QR a partir de texto o URL.",
    }, */
    {
        id: "color-palette",
        label: "Color Palette",
        icon: MdColorLens,
        component: ColorPalette,
        description: "Herramienta para seleccionar y generar paletas de colores.",
    },
];
