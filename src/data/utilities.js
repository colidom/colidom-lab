import { MdQrCode } from "react-icons/md";
import QrGenerator from "../components/QrGenerator";

export const utilityTools = [
    {
        id: "qr-generator",
        label: "Generador QR",
        icon: MdQrCode,
        component: QrGenerator,
        description: "Genera códigos QR a partir de texto, URLs y otros datos.",
    },
];
