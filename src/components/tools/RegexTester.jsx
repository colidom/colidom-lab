import React, { useState, useEffect } from "react";
import { MdContentCopy, MdCheckCircle, MdError } from "react-icons/md";

export default function RegexTester() {
    const [pattern, setPattern] = useState("");
    const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false, u: false });
    const [testString, setTestString] = useState("");
    const [matches, setMatches] = useState([]);
    const [error, setError] = useState(null);
    const [highlightedText, setHighlightedText] = useState("");

    const commonPatterns = [
        { name: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", example: "test@example.com" },
        { name: "URL", pattern: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&\\/\\/=]*)", example: "https://www.example.com" },
        { name: "Teléfono", pattern: "\\+?[0-9]{1,4}?[-.\\s]?\\(?[0-9]{1,3}?\\)?[-.\\s]?[0-9]{1,4}[-.\\s]?[0-9]{1,4}[-.\\s]?[0-9]{1,9}", example: "+34 600 123 456" },
        { name: "IPv4", pattern: "\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b", example: "192.168.1.1" },
        { name: "Fecha (DD/MM/YYYY)", pattern: "\\b(0?[1-9]|[12][0-9]|3[01])[\\/\\-](0?[1-9]|1[012])[\\/\\-]\\d{4}\\b", example: "25/12/2024" },
        { name: "Hora (HH:MM)", pattern: "([01]?[0-9]|2[0-3]):[0-5][0-9]", example: "14:30" },
        { name: "Código Postal (ES)", pattern: "\\b[0-5][0-9]{4}\\b", example: "28001" },
        { name: "Hexadecimal", pattern: "#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})", example: "#FF5733" },
    ];

    useEffect(() => {
        if (!pattern || !testString) {
            setMatches([]);
            setError(null);
            setHighlightedText(testString);
            return;
        }

        try {
            const flagsStr = Object.keys(flags).filter(k => flags[k]).join('');
            const regex = new RegExp(pattern, flagsStr);
            const foundMatches = [];
            let match;

            if (flags.g) {
                // Global: encontrar todas las coincidencias
                while ((match = regex.exec(testString)) !== null) {
                    foundMatches.push({
                        match: match[0],
                        index: match.index,
                        groups: match.slice(1),
                    });
                    // Prevenir loops infinitos
                    if (match.index === regex.lastIndex) {
                        regex.lastIndex++;
                    }
                }
            } else {
                // Sin global: solo primera coincidencia
                match = regex.exec(testString);
                if (match) {
                    foundMatches.push({
                        match: match[0],
                        index: match.index,
                        groups: match.slice(1),
                    });
                }
            }

            setMatches(foundMatches);
            setError(null);
            highlightMatches(foundMatches);
        } catch (err) {
            setError(err.message);
            setMatches([]);
            setHighlightedText(testString);
        }
    }, [pattern, flags, testString]);

    const highlightMatches = (foundMatches) => {
        if (foundMatches.length === 0) {
            setHighlightedText(testString);
            return;
        }

        let result = "";
        let lastIndex = 0;

        foundMatches.forEach((match, i) => {
            result += testString.slice(lastIndex, match.index);
            result += `<mark class="bg-yellow-300 dark:bg-yellow-600 px-1 rounded">${match.match}</mark>`;
            lastIndex = match.index + match.match.length;
        });

        result += testString.slice(lastIndex);
        setHighlightedText(result);
    };

    const toggleFlag = (flag) => {
        setFlags({ ...flags, [flag]: !flags[flag] });
    };

    const loadPattern = (p) => {
        setPattern(p.pattern);
        setTestString(p.example);
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Pattern Input */}
            <div className="p-6 rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <label className="block text-lg font-semibold text-rose-600 dark:text-rose-400 mb-3">
                    🔍 Expresión Regular
                </label>
                <div className="flex gap-2 mb-4">
                    <span className="flex items-center text-2xl text-gray-600 dark:text-gray-400">/</span>
                    <input
                        type="text"
                        value={pattern}
                        onChange={(e) => setPattern(e.target.value)}
                        placeholder="Escribe tu regex aquí..."
                        className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 
                            bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm font-mono
                            text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                            focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <span className="flex items-center text-2xl text-gray-600 dark:text-gray-400">/</span>
                </div>

                {/* Flags */}
                <div className="flex flex-wrap gap-3 mb-4">
                    {[
                        { key: 'g', label: 'Global', desc: 'Buscar todas las coincidencias' },
                        { key: 'i', label: 'Ignorar mayúsculas', desc: 'Case insensitive' },
                        { key: 'm', label: 'Multilínea', desc: '^$ coincide con inicio/fin de línea' },
                        { key: 's', label: 'Dotall', desc: '. coincide con saltos de línea' },
                        { key: 'u', label: 'Unicode', desc: 'Habilita soporte Unicode completo' },
                    ].map(flag => (
                        <button
                            key={flag.key}
                            onClick={() => toggleFlag(flag.key)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                                ${flags[flag.key]
                                    ? 'bg-rose-500 text-white shadow-md'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                }`}
                            title={flag.desc}
                        >
                            {flag.key} - {flag.label}
                        </button>
                    ))}
                </div>

                {/* Patrones comunes */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Patrones comunes:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {commonPatterns.map((p, i) => (
                            <button
                                key={i}
                                onClick={() => loadPattern(p)}
                                className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 
                                    hover:bg-gray-200 dark:hover:bg-gray-600 text-xs font-medium
                                    text-gray-700 dark:text-gray-300 transition-colors duration-200"
                            >
                                {p.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Test String */}
            <div className="p-6 rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <label className="block text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3">
                    📝 Texto a Evaluar
                </label>
                <textarea
                    value={testString}
                    onChange={(e) => setTestString(e.target.value)}
                    placeholder="Pega aquí el texto donde quieres buscar coincidencias..."
                    className="w-full h-32 p-4 rounded-lg border border-gray-300 dark:border-gray-600 
                        bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm resize-none
                        text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Error */}
            {error && (
                <div className="p-5 rounded-xl bg-red-50/50 dark:bg-red-900/20 backdrop-blur-sm 
                    border-2 border-red-300 dark:border-red-800 flex items-start gap-3">
                    <MdError className="text-2xl text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-red-800 dark:text-red-300 mb-1">Error en la expresión regular</h4>
                        <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                    </div>
                </div>
            )}

            {/* Results */}
            {!error && pattern && testString && (
                <div className="space-y-4">
                    {/* Estadísticas */}
                    <div className={`p-5 rounded-xl backdrop-blur-sm border-2 flex items-center gap-3
                        ${matches.length > 0
                            ? 'bg-green-50/50 dark:bg-green-900/20 border-green-300 dark:border-green-800'
                            : 'bg-orange-50/50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-800'
                        }`}
                    >
                        {matches.length > 0 ? (
                            <MdCheckCircle className="text-3xl text-green-600 dark:text-green-400 flex-shrink-0" />
                        ) : (
                            <MdError className="text-3xl text-orange-600 dark:text-orange-400 flex-shrink-0" />
                        )}
                        <div>
                            <h4 className={`font-bold text-lg ${matches.length > 0 ? 'text-green-800 dark:text-green-300' : 'text-orange-800 dark:text-orange-300'}`}>
                                {matches.length > 0 ? `${matches.length} coincidencia${matches.length !== 1 ? 's' : ''} encontrada${matches.length !== 1 ? 's' : ''}` : 'Sin coincidencias'}
                            </h4>
                        </div>
                    </div>

                    {/* Texto con highlights */}
                    {matches.length > 0 && (
                        <div className="p-6 rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Vista Previa (Coincidencias resaltadas)
                            </h3>
                            <div 
                                className="p-4 rounded-lg bg-white/50 dark:bg-gray-700/50 
                                    text-gray-900 dark:text-white whitespace-pre-wrap break-words"
                                dangerouslySetInnerHTML={{ __html: highlightedText }}
                            />
                        </div>
                    )}

                    {/* Detalles de coincidencias */}
                    {matches.length > 0 && (
                        <div className="p-6 rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Detalles de Coincidencias
                            </h3>
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {matches.map((match, index) => (
                                    <div key={index} className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 
                                        dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
                                                Coincidencia #{index + 1}
                                            </span>
                                            <button
                                                onClick={() => handleCopy(match.match)}
                                                className="p-1 hover:bg-purple-200 dark:hover:bg-purple-800 rounded"
                                                title="Copiar"
                                            >
                                                <MdContentCopy size={14} />
                                            </button>
                                        </div>
                                        <div className="space-y-1 text-sm">
                                            <div className="flex gap-2">
                                                <span className="font-semibold text-purple-600 dark:text-purple-400">Texto:</span>
                                                <code className="font-mono bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded">
                                                    {match.match}
                                                </code>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="font-semibold text-purple-600 dark:text-purple-400">Posición:</span>
                                                <span className="text-gray-700 dark:text-gray-300">{match.index}</span>
                                            </div>
                                            {match.groups.length > 0 && (
                                                <div className="flex gap-2">
                                                    <span className="font-semibold text-purple-600 dark:text-purple-400">Grupos:</span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {match.groups.map((group, i) => (
                                                            group && (
                                                                <code key={i} className="font-mono bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded text-xs">
                                                                    ${i + 1}: {group}
                                                                </code>
                                                            )
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Información */}
            <div className="p-6 rounded-xl bg-blue-50/50 dark:bg-blue-900/20 backdrop-blur-sm border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">ℹ️ Ayuda rápida de Regex</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-400">
                    <div>
                        <strong>Caracteres especiales:</strong>
                        <ul className="text-xs mt-1 space-y-1 font-mono">
                            <li>. = cualquier carácter</li>
                            <li>^ = inicio de cadena</li>
                            <li>$ = fin de cadena</li>
                            <li>* = 0 o más veces</li>
                            <li>+ = 1 o más veces</li>
                            <li>? = 0 o 1 vez</li>
                        </ul>
                    </div>
                    <div>
                        <strong>Clases de caracteres:</strong>
                        <ul className="text-xs mt-1 space-y-1 font-mono">
                            <li>\d = dígito [0-9]</li>
                            <li>\w = palabra [a-zA-Z0-9_]</li>
                            <li>\s = espacio en blanco</li>
                            <li>[abc] = a, b, o c</li>
                            <li>[^abc] = no a, b, ni c</li>
                            <li>(x) = grupo de captura</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
