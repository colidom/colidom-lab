import React, { useState } from "react";
import { useScrollEffects } from "../hooks/useScrollEffects";
import { MdArrowRight, MdExpandMore } from "react-icons/md";

const ToolCard = ({ tool }) => {
    const { handleNavClick } = useScrollEffects();
    const [isExpanded, setIsExpanded] = useState(false);
    const IconComponent = tool.icon;

    const { name, shortDescription, description, features, colorClasses } = tool;

    return (
        <div
            className={`
                relative flex flex-col p-6 rounded-lg border ${colorClasses.border}
                bg-white dark:bg-gray-800 transition-all duration-300
                hover:shadow-lg min-h-[12rem]
            `}
        >
            {/* Encabezado y título de la tarjeta */}
            <div className="flex items-start justify-between mb-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                {/* Contenedor del ícono (ancho fijo) */}
                <div className="flex-shrink-0 mr-4">{IconComponent && <IconComponent className={`h-12 w-12 ${colorClasses.icon}`} />}</div>

                {/* Contenedor del texto (crece para ocupar espacio) */}
                <div className="flex-grow text-left">
                    <h3 className={`text-2xl font-bold ${colorClasses.title} mb-1`}>{name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{shortDescription}</p>
                </div>

                {/* Expand/Collapse Button */}
                <button
                    className={`
                        p-1 rounded-full transition-transform duration-300
                        ${isExpanded ? "transform rotate-180" : ""}
                        ${colorClasses.icon}
                    `}
                    aria-label={isExpanded ? "Show less" : "Show more"}
                >
                    <MdExpandMore size={24} />
                </button>
            </div>

            {/* Contenido detallado (condicionalmente renderizado) */}
            {isExpanded && (
                <div className="flex-grow flex flex-col justify-between text-left animate-slide-down">
                    <div>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">{description}</p>
                        <ul className="list-none space-y-2">
                            {features.map((feature, index) => (
                                <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                    <MdArrowRight className="h-4 w-4 text-blue-500 mr-2" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleNavClick(e, tool.id);
                        }}
                        className={`
                            mt-4 w-full py-2 text-white font-semibold rounded-md
                            ${colorClasses.button}
                        `}
                    >
                        Usar herramienta
                    </button>
                </div>
            )}

            {/* Botón principal cuando la tarjeta NO está expandida */}
            {!isExpanded && (
                <button
                    onClick={(e) => handleNavClick(e, tool.id)}
                    className={`
                        mt-auto w-full py-2 text-white font-semibold rounded-md
                        ${colorClasses.button}
                    `}
                >
                    Usar herramienta
                </button>
            )}
        </div>
    );
};

export default ToolCard;
