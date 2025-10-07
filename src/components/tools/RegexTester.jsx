import React, { useState, useEffect } from "react";
import { MdContentCopy, MdCheckCircle, MdError, MdSearch, MdTextFields, MdHighlight } from "react-icons/md";

export default function RegexTester() {
    const [pattern, setPattern] = useState("");
    const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false, u: false });
    const [testString, setTestString] = useState("");
    const [matches, setMatches] = useState([]);
    const [error, setError] = useState(null);
    const [highlightedText, setHighlightedText] = useState("");
    const [copiedMatch, setCopiedMatch] = useState(null);

    const commonPatterns = [
        { name: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", example: "test@example.com, admin@colidom.dev, info@company.es" },
        { name: "URL", pattern: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&\\/\\/=]*)", example: "https://www.example.com y http://colidom.dev" },
        { name: "Teléfono", pattern: "\\+?[0-9]{1,4}?[-.\\s]?\\(?[0-9]{1,3}?\\)?[-.\\s]?[0-9]{1,4}[-.\\s]?[0-9]{1,4}[-.\\s]?[0-9]{1,9}", example: "+34 600 123 456 o 912345678" },
        { name: "IPv4", pattern: "\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b", example: "192.168.1.1 y 10.0.0.1" },
        { name: "Fecha (DD/MM/YYYY)", pattern: "\\b(0?[1-9]|[12][0-9]|3[01])[\\/\\-](0?[1-9]|1[012])[\\/\\-]\\d{4}\\b", example: "25/12/2024 y 01-01-2025" },
        { name: "Hora (HH:MM)", pattern: "([01]?[0-9]|2[0-3]):[0-5][0-9]", example: "14:30 y 09:15" },
        { name: "Código Postal (ES)", pattern: "\\b[0-5][0-9]{4}\\b", example: "28001, 08001, 41001" },
        { name: "Hexadecimal", pattern: "#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})", example: "#FF5733 y #F00" },
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
                while ((match = regex.exec(testString)) !== null) {
                    foundMatches.push({
                        match: match[0],
                        index: match.index,
                        groups: match.slice(1),
                    });
                    if (match.index === regex.lastIndex) {
                        regex.lastIndex++;
                    }
                }
            } else {
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
            result += `<mark class="bg-gradient-to-r from-orange-300 to-red-300 dark:from-orange-600 dark:to-red-600 px-1.5 py-0.5 rounded font-semibold">${match.match}</mark>`;
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

    const handleCopy = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedMatch(index);
        setTimeout(() => setCopiedMatch(null), 2000);
    };

    const flagsInfo = [
        { key: 'g', label: 'Global (g)', desc: 'Buscar todas las coincidencias', icon: '🌐' },
        { key: 'i', label: 'Ignorar (i)', desc: 'Case insensitive', icon: '🔡' },
        { key: 'm', label: 'Multilínea (m)', desc: '^$ coincide con inicio/fin de línea', icon: '📄' },
        { key: 's', label: 'Dotall (s)', desc: '. coincide con saltos de línea', icon: '⚫' },
        { key: 'u', label: 'Unicode (u)', desc: 'Soporte Unicode completo', icon: '🌍' },
    ];

    return (
        <div className="space-y-6">
            {/* Sección: Expresión Regular */}
            <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                    <h2 className="text-xl font-bold text-orange-600 dark:text-orange-400 flex items-center gap-2">
                        <MdSearch className="text-2xl" />
                        Expresión Regular
                    </h2>
                </div>

                <div className="space-y-4">
                    {/* Input de Pattern */}
                    <div className="flex items-center gap-2">
                        <span className="text-3xl font-mono font-bold text-orange-500">/</span>
                        <input
                            type="text"
                            value={pattern}
                            onChange={(e) => setPattern(e.target.value)}
                            placeholder="Escribe tu expresión regular aquí..."
                            className="flex-1 px-4 py-3 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 
                                focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all font-mono text-lg
                                bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700
                                shadow-inner"
                        />
                        <span className="text-3xl font-mono font-bold text-orange-500">/</span>
                    </div>

                    {/* Flags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Modificadores (Flags)</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                            {flagsInfo.map(flag => (
                                <button
                                    key={flag.key}
                                    onClick={() => toggleFlag(flag.key)}
                                    className={`
                                        group relative px-4 py-3 rounded-xl font-medium transition-all duration-300
                                        flex flex-col items-center gap-1 text-center
                                        ${flags[flag.key]
                                            ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30 scale-[1.02]'
                                            : 'bg-white/70 dark:bg-gray-900/70 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900 hover:shadow-md border border-gray-200 dark:border-gray-700'
                                        }
                                    `}
                                    title={flag.desc}
                                >
                                    <span className="text-xl">{flag.icon}</span>
                                    <span className="text-sm font-bold">{flag.label}</span>
                                    {flags[flag.key] && (
                                        <MdCheckCircle className="absolute top-2 right-2 text-white text-lg" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Patrones Comunes */}
                    <div className="p-4 rounded-xl bg-orange-50/50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/30">
                        <h4 className="text-sm font-semibold text-orange-700 dark:text-orange-400 mb-3 flex items-center gap-2">
                            ⚡ Patrones Comunes
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {commonPatterns.map((p, i) => (
                                <button
                                    key={i}
                                    onClick={() => loadPattern(p)}
                                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 
                                        hover:bg-orange-100 dark:hover:bg-orange-900 text-xs font-medium
                                        text-gray-700 dark:text-gray-300 transition-all duration-200
                                        border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700"
                                >
                                    {p.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección: Texto de Prueba */}
            <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                    <h2 className="text-xl font-bold text-orange-600 dark:text-orange-400 flex items-center gap-2">
                        <MdTextFields className="text-2xl" />
                        Texto de Prueba
                    </h2>
                </div>

                <textarea
                    value={testString}
                    onChange={(e) => setTestString(e.target.value)}
                    placeholder="Pega aquí el texto donde quieres buscar coincidencias..."
                    className="w-full h-40 px-4 py-3 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 
                        focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all resize-none
                        bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700
                        shadow-inner"
                />
            </div>

            {/* Error */}
            {error && (
                <div className="bg-gradient-to-br from-red-50/50 to-red-50/30 dark:from-red-900/20 dark:to-red-900/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-red-200/50 dark:border-red-800/30 animate-slide-in">
                    <div className="flex items-start gap-3">
                        <MdError className="text-3xl text-red-600 dark:text-red-400 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-lg text-red-800 dark:text-red-300 mb-1">Error en la expresión regular</h4>
                            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Resultados */}
            {!error && pattern && testString && (
                <div className="space-y-6">
                    {/* Estadísticas */}
                    <div className={`bg-gradient-to-br backdrop-blur-xl rounded-2xl p-6 shadow-lg border animate-slide-in
                        ${matches.length > 0
                            ? 'from-green-50/50 to-green-50/30 dark:from-green-900/20 dark:to-green-900/10 border-green-200/50 dark:border-green-800/30'
                            : 'from-orange-50/50 to-orange-50/30 dark:from-orange-900/20 dark:to-orange-900/10 border-orange-200/50 dark:border-orange-800/30'
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            {matches.length > 0 ? (
                                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 
                                    flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                                    {matches.length}
                                </div>
                            ) : (
                                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 
                                    flex items-center justify-center shadow-lg">
                                    <MdError className="text-white text-3xl" />
                                </div>
                            )}
                            <div>
                                <h4 className={`font-bold text-2xl ${matches.length > 0 ? 'text-green-800 dark:text-green-300' : 'text-orange-800 dark:text-orange-300'}`}>
                                    {matches.length > 0 ? `${matches.length} coincidencia${matches.length !== 1 ? 's' : ''} encontrada${matches.length !== 1 ? 's' : ''}` : 'Sin coincidencias'}
                                </h4>
                                <p className={`text-sm ${matches.length > 0 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                                    {matches.length > 0 ? 'Tu expresión regular coincide con el texto' : 'Intenta ajustar tu expresión regular'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Vista Previa con Highlights */}
                    {matches.length > 0 && (
                        <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                                <h2 className="text-xl font-bold text-orange-600 dark:text-orange-400 flex items-center gap-2">
                                    <MdHighlight className="text-2xl" />
                                    Vista Previa (Coincidencias Resaltadas)
                                </h2>
                            </div>
                            <div 
                                className="p-4 rounded-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700
                                    text-gray-900 dark:text-white whitespace-pre-wrap break-words leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: highlightedText }}
                            />
                        </div>
                    )}

                    {/* Detalles de Coincidencias */}
                    {matches.length > 0 && (
                        <div className="bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-800/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                                <h2 className="text-xl font-bold text-orange-600 dark:text-orange-400">
                                    Detalles de Coincidencias
                                </h2>
                            </div>
                            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                                {matches.map((match, index) => (
                                    <div key={index} className="group p-5 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 
                                        dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800
                                        hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 
                                                    flex items-center justify-center text-white font-bold text-sm shadow-md">
                                                    {index + 1}
                                                </div>
                                                <span className="text-sm font-bold text-orange-700 dark:text-orange-300">
                                                    Coincidencia #{index + 1}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleCopy(match.match, index)}
                                                className="p-2 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-900 transition-colors"
                                                title="Copiar"
                                            >
                                                {copiedMatch === index ? (
                                                    <MdCheckCircle className="text-green-500 text-lg" />
                                                ) : (
                                                    <MdContentCopy className="text-orange-600 dark:text-orange-400 text-lg" />
                                                )}
                                            </button>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                <span className="font-semibold text-orange-600 dark:text-orange-400 min-w-[80px]">Texto:</span>
                                                <code className="flex-1 font-mono bg-white dark:bg-gray-900 px-3 py-2 rounded-lg border border-orange-200 dark:border-orange-800">
                                                    {match.match}
                                                </code>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-orange-600 dark:text-orange-400 min-w-[80px]">Posición:</span>
                                                <span className="text-gray-700 dark:text-gray-300">{match.index}</span>
                                            </div>
                                            {match.groups.length > 0 && match.groups.some(g => g) && (
                                                <div className="flex flex-col gap-2">
                                                    <span className="font-semibold text-orange-600 dark:text-orange-400">Grupos capturados:</span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {match.groups.map((group, i) => (
                                                            group && (
                                                                <code key={i} className="font-mono bg-white dark:bg-gray-900 px-3 py-1.5 rounded-lg text-xs
                                                                    border border-orange-200 dark:border-orange-800">
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

            {/* Sección: Información */}
            <div className="bg-gradient-to-br from-blue-50/50 to-blue-50/30 dark:from-blue-900/20 dark:to-blue-900/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-blue-200/50 dark:border-blue-800/30">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <span className="text-2xl">💡</span>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">
                            Ayuda Rápida de Regex
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-400">
                            <div>
                                <strong>Caracteres especiales:</strong>
                                <ul className="text-xs mt-2 space-y-1 font-mono bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                                    <li><code className="text-blue-800 dark:text-blue-300">.</code> = cualquier carácter</li>
                                    <li><code className="text-blue-800 dark:text-blue-300">^</code> = inicio de cadena</li>
                                    <li><code className="text-blue-800 dark:text-blue-300">$</code> = fin de cadena</li>
                                    <li><code className="text-blue-800 dark:text-blue-300">*</code> = 0 o más veces</li>
                                    <li><code className="text-blue-800 dark:text-blue-300">+</code> = 1 o más veces</li>
                                    <li><code className="text-blue-800 dark:text-blue-300">?</code> = 0 o 1 vez</li>
                                </ul>
                            </div>
                            <div>
                                <strong>Clases de caracteres:</strong>
                                <ul className="text-xs mt-2 space-y-1 font-mono bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                                    <li><code className="text-blue-800 dark:text-blue-300">\d</code> = dígito [0-9]</li>
                                    <li><code className="text-blue-800 dark:text-blue-300">\w</code> = palabra [a-zA-Z0-9_]</li>
                                    <li><code className="text-blue-800 dark:text-blue-300">\s</code> = espacio en blanco</li>
                                    <li><code className="text-blue-800 dark:text-blue-300">[abc]</code> = a, b, o c</li>
                                    <li><code className="text-blue-800 dark:text-blue-300">[^abc]</code> = no a, b, ni c</li>
                                    <li><code className="text-blue-800 dark:text-blue-300">(x)</code> = grupo de captura</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
