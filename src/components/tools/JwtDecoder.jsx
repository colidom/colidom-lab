import React, { useState, useEffect } from "react";
import { MdContentCopy, MdWarning, MdCheckCircle } from "react-icons/md";

export default function JwtDecoder() {
    const [jwt, setJwt] = useState("");
    const [decoded, setDecoded] = useState(null);
    const [error, setError] = useState(null);
    const [copiedPart, setCopiedPart] = useState("");

    const decodeJWT = (token) => {
        try {
            const parts = token.split('.');
            
            if (parts.length !== 3) {
                throw new Error("JWT inválido: debe tener 3 partes separadas por puntos");
            }

            const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
            const signature = parts[2];

            // Verificar expiración
            let isExpired = false;
            if (payload.exp) {
                isExpired = Date.now() >= payload.exp * 1000;
            }

            setDecoded({
                header,
                payload,
                signature,
                isExpired,
                raw: { header: parts[0], payload: parts[1], signature: parts[2] }
            });
            setError(null);
        } catch (err) {
            setError(err.message);
            setDecoded(null);
        }
    };

    useEffect(() => {
        if (!jwt.trim()) {
            setDecoded(null);
            setError(null);
            return;
        }
        decodeJWT(jwt);
    }, [jwt]);

    const handleCopy = (text, part) => {
        navigator.clipboard.writeText(typeof text === 'string' ? text : JSON.stringify(text, null, 2));
        setCopiedPart(part);
        setTimeout(() => setCopiedPart(""), 2000);
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Input JWT */}
            <div className="p-6 rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <label className="block text-lg font-semibold text-cyan-600 dark:text-cyan-400 mb-3">
                    JWT Token
                </label>
                <textarea
                    value={jwt}
                    onChange={(e) => setJwt(e.target.value)}
                    placeholder="Pega tu JWT token aquí..."
                    className="w-full h-32 p-4 rounded-lg border border-gray-300 dark:border-gray-600 
                        bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm resize-none font-mono text-sm
                        text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                />
                {jwt && (
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Caracteres: {jwt.length}
                    </p>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="p-5 rounded-xl bg-red-50/50 dark:bg-red-900/20 backdrop-blur-sm 
                    border-2 border-red-300 dark:border-red-800 flex items-start gap-3">
                    <MdWarning className="text-2xl text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-red-800 dark:text-red-300 mb-1">Error al decodificar</h4>
                        <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                    </div>
                </div>
            )}

            {/* Decoded JWT */}
            {decoded && (
                <div className="space-y-6">
                    {/* Estado del Token */}
                    <div className={`p-5 rounded-xl backdrop-blur-sm border-2 flex items-center gap-3
                        ${decoded.isExpired 
                            ? 'bg-red-50/50 dark:bg-red-900/20 border-red-300 dark:border-red-800' 
                            : 'bg-green-50/50 dark:bg-green-900/20 border-green-300 dark:border-green-800'
                        }`}
                    >
                        {decoded.isExpired ? (
                            <MdWarning className="text-3xl text-red-600 dark:text-red-400 flex-shrink-0" />
                        ) : (
                            <MdCheckCircle className="text-3xl text-green-600 dark:text-green-400 flex-shrink-0" />
                        )}
                        <div>
                            <h4 className={`font-bold text-lg ${decoded.isExpired ? 'text-red-800 dark:text-red-300' : 'text-green-800 dark:text-green-300'}`}>
                                {decoded.isExpired ? 'Token Expirado' : 'Token Válido'}
                            </h4>
                            {decoded.payload.exp && (
                                <p className={`text-sm ${decoded.isExpired ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'}`}>
                                    Expiró el: {formatDate(decoded.payload.exp)}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Header */}
                    <div className="p-6 rounded-xl bg-blue-50/50 dark:bg-blue-900/20 backdrop-blur-sm 
                        border-2 border-blue-200 dark:border-blue-800">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300">
                                📋 Header
                            </h3>
                            <button
                                onClick={() => handleCopy(decoded.header, 'header')}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg
                                    bg-blue-200/50 dark:bg-blue-800/50 hover:bg-blue-200 dark:hover:bg-blue-800
                                    text-blue-800 dark:text-blue-300 transition-colors duration-200 text-sm"
                            >
                                <MdContentCopy size={14} />
                                {copiedPart === 'header' ? '¡Copiado!' : 'Copiar'}
                            </button>
                        </div>
                        <pre className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 overflow-x-auto">
                            <code className="text-sm text-blue-900 dark:text-blue-200">
                                {JSON.stringify(decoded.header, null, 2)}
                            </code>
                        </pre>
                    </div>

                    {/* Payload */}
                    <div className="p-6 rounded-xl bg-purple-50/50 dark:bg-purple-900/20 backdrop-blur-sm 
                        border-2 border-purple-200 dark:border-purple-800">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-purple-800 dark:text-purple-300">
                                📦 Payload
                            </h3>
                            <button
                                onClick={() => handleCopy(decoded.payload, 'payload')}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg
                                    bg-purple-200/50 dark:bg-purple-800/50 hover:bg-purple-200 dark:hover:bg-purple-800
                                    text-purple-800 dark:text-purple-300 transition-colors duration-200 text-sm"
                            >
                                <MdContentCopy size={14} />
                                {copiedPart === 'payload' ? '¡Copiado!' : 'Copiar'}
                            </button>
                        </div>
                        <pre className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 overflow-x-auto">
                            <code className="text-sm text-purple-900 dark:text-purple-200">
                                {JSON.stringify(decoded.payload, null, 2)}
                            </code>
                        </pre>

                        {/* Claims comunes */}
                        {(decoded.payload.iat || decoded.payload.nbf) && (
                            <div className="mt-4 p-4 rounded-lg bg-purple-100/50 dark:bg-purple-900/30">
                                <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2 text-sm">
                                    Fechas importantes:
                                </h4>
                                {decoded.payload.iat && (
                                    <p className="text-xs text-purple-700 dark:text-purple-400">
                                        <strong>Emitido (iat):</strong> {formatDate(decoded.payload.iat)}
                                    </p>
                                )}
                                {decoded.payload.nbf && (
                                    <p className="text-xs text-purple-700 dark:text-purple-400">
                                        <strong>No antes de (nbf):</strong> {formatDate(decoded.payload.nbf)}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Signature */}
                    <div className="p-6 rounded-xl bg-orange-50/50 dark:bg-orange-900/20 backdrop-blur-sm 
                        border-2 border-orange-200 dark:border-orange-800">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-orange-800 dark:text-orange-300">
                                🔒 Signature
                            </h3>
                            <button
                                onClick={() => handleCopy(decoded.signature, 'signature')}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg
                                    bg-orange-200/50 dark:bg-orange-800/50 hover:bg-orange-200 dark:hover:bg-orange-800
                                    text-orange-800 dark:text-orange-300 transition-colors duration-200 text-sm"
                            >
                                <MdContentCopy size={14} />
                                {copiedPart === 'signature' ? '¡Copiado!' : 'Copiar'}
                            </button>
                        </div>
                        <div className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
                            <code className="text-sm font-mono text-orange-900 dark:text-orange-200 break-all">
                                {decoded.signature}
                            </code>
                        </div>
                        <p className="mt-3 text-xs text-orange-700 dark:text-orange-400">
                            ⚠️ La firma debe verificarse en el servidor con la clave secreta apropiada
                        </p>
                    </div>
                </div>
            )}

            {/* Información */}
            <div className="p-6 rounded-xl bg-blue-50/50 dark:bg-blue-900/20 backdrop-blur-sm border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">ℹ️ Sobre JWT</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-2 list-disc list-inside">
                    <li><strong>Header:</strong> Contiene el tipo de token y algoritmo de firma</li>
                    <li><strong>Payload:</strong> Contiene los claims (datos) del token</li>
                    <li><strong>Signature:</strong> Asegura que el token no ha sido modificado</li>
                    <li><strong>⚠️ Advertencia:</strong> Los JWT son decodificables por cualquiera. No incluyas información sensible en el payload</li>
                </ul>
            </div>
        </div>
    );
}
