import React, { useState, useEffect } from "react";
import { MdContentCopy, MdRefresh, MdSecurity } from "react-icons/md";

export default function PasswordGenerator() {
    const [password, setPassword] = useState("");
    const [length, setLength] = useState(16);
    const [options, setOptions] = useState({
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
    });
    const [strength, setStrength] = useState({ level: 0, text: "", color: "" });
    const [isCopied, setIsCopied] = useState(false);

    const charSets = {
        uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        lowercase: "abcdefghijklmnopqrstuvwxyz",
        numbers: "0123456789",
        symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
    };

    const generatePassword = () => {
        let charset = "";
        let newPassword = "";

        Object.keys(options).forEach((key) => {
            if (options[key]) charset += charSets[key];
        });

        if (charset === "") {
            setPassword("");
            return;
        }

        // Asegurar al menos un carácter de cada tipo seleccionado
        Object.keys(options).forEach((key) => {
            if (options[key]) {
                const chars = charSets[key];
                newPassword += chars[Math.floor(Math.random() * chars.length)];
            }
        });

        // Rellenar el resto
        for (let i = newPassword.length; i < length; i++) {
            newPassword += charset[Math.floor(Math.random() * charset.length)];
        }

        // Mezclar aleatoriamente
        newPassword = newPassword.split('').sort(() => Math.random() - 0.5).join('');
        
        setPassword(newPassword);
        setIsCopied(false);
    };

    const calculateStrength = (pwd) => {
        if (!pwd) {
            setStrength({ level: 0, text: "Sin contraseña", color: "gray" });
            return;
        }

        let score = 0;
        
        // Longitud
        if (pwd.length >= 8) score += 1;
        if (pwd.length >= 12) score += 1;
        if (pwd.length >= 16) score += 1;
        
        // Complejidad
        if (/[a-z]/.test(pwd)) score += 1;
        if (/[A-Z]/.test(pwd)) score += 1;
        if (/[0-9]/.test(pwd)) score += 1;
        if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

        if (score <= 2) {
            setStrength({ level: 1, text: "Débil", color: "red" });
        } else if (score <= 4) {
            setStrength({ level: 2, text: "Media", color: "yellow" });
        } else if (score <= 5) {
            setStrength({ level: 3, text: "Fuerte", color: "green" });
        } else {
            setStrength({ level: 4, text: "Muy Fuerte", color: "emerald" });
        }
    };

    useEffect(() => {
        generatePassword();
    }, [length, options]);

    useEffect(() => {
        calculateStrength(password);
    }, [password]);

    const handleCopy = () => {
        navigator.clipboard.writeText(password);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const toggleOption = (key) => {
        const newOptions = { ...options, [key]: !options[key] };
        // Al menos una opción debe estar activa
        if (Object.values(newOptions).some(v => v)) {
            setOptions(newOptions);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Contraseña Generada */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 
                backdrop-blur-xl shadow-lg border-2 border-indigo-200 dark:border-indigo-800">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                        <MdSecurity size={24} />
                        Contraseña Generada
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick={generatePassword}
                            className="p-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white 
                                transition-colors duration-200"
                            title="Regenerar"
                        >
                            <MdRefresh size={20} />
                        </button>
                        <button
                            onClick={handleCopy}
                            disabled={!password}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200
                                ${password 
                                    ? 'bg-indigo-500 hover:bg-indigo-600 text-white' 
                                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            <MdContentCopy size={16} />
                            {isCopied ? "¡Copiado!" : "Copiar"}
                        </button>
                    </div>
                </div>

                <div className="p-5 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
                    <code className="text-2xl font-mono text-gray-800 dark:text-gray-200 break-all select-all">
                        {password || "Genera una contraseña..."}
                    </code>
                </div>

                {/* Indicador de Fortaleza */}
                {password && (
                    <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Fortaleza:
                            </span>
                            <span className={`text-sm font-bold text-${strength.color}-600 dark:text-${strength.color}-400`}>
                                {strength.text}
                            </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                                className={`h-full bg-${strength.color}-500 transition-all duration-500`}
                                style={{ width: `${(strength.level / 4) * 100}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Configuración */}
            <div className="p-6 rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Configuración
                </h3>

                {/* Longitud */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Longitud: {length}
                        </label>
                    </div>
                    <input
                        type="range"
                        min="4"
                        max="64"
                        value={length}
                        onChange={(e) => setLength(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer
                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>4</span>
                        <span>64</span>
                    </div>
                </div>

                {/* Opciones */}
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Incluir caracteres:
                    </h4>
                    
                    {[
                        { key: 'uppercase', label: 'Mayúsculas (A-Z)', example: 'ABC' },
                        { key: 'lowercase', label: 'Minúsculas (a-z)', example: 'abc' },
                        { key: 'numbers', label: 'Números (0-9)', example: '123' },
                        { key: 'symbols', label: 'Símbolos (!@#$%...)', example: '!@#' },
                    ].map(({ key, label, example }) => (
                        <label
                            key={key}
                            className="flex items-center justify-between p-3 rounded-lg cursor-pointer
                                bg-white/50 dark:bg-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-700/70
                                transition-colors duration-200"
                        >
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={options[key]}
                                    onChange={() => toggleOption(key)}
                                    className="w-5 h-5 rounded border-gray-300 text-indigo-500 
                                        focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {label}
                                </span>
                            </div>
                            <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                {example}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Consejos */}
            <div className="p-6 rounded-xl bg-blue-50/50 dark:bg-blue-900/20 backdrop-blur-sm border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">💡 Consejos de Seguridad</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-2 list-disc list-inside">
                    <li>Usa contraseñas de al menos 12-16 caracteres</li>
                    <li>Combina mayúsculas, minúsculas, números y símbolos</li>
                    <li>No reutilices contraseñas entre sitios diferentes</li>
                    <li>Considera usar un gestor de contraseñas</li>
                    <li>Cambia las contraseñas regularmente</li>
                </ul>
            </div>
        </div>
    );
}
