import React, { useState } from "react";
import { useScrollEffects } from "../hooks/useScrollEffects";
import { MdArrowRight } from "react-icons/md";

const ToolCard = ({ tool }) => {
    const { handleNavClick } = useScrollEffects();
    const [isHovered, setIsHovered] = useState(false);
    const IconComponent = tool.icon;

    const { name, shortDescription, description, features, colorClasses } = tool;

    return (
        <button
            onClick={(e) => handleNavClick(e, tool.id)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
                relative flex flex-col p-6 rounded-lg border ${colorClasses.border}
                bg-white dark:bg-gray-800 transition-all duration-300
                hover:shadow-lg transform hover:scale-[1.02]
            `}
        >
            {/* Encabezado y título de la tarjeta */}
            <div className="flex items-center mb-4">
                {IconComponent && <IconComponent className={`h-12 w-12 ${colorClasses.icon} mr-4`} />}
                <div className="text-left">
                    <h3 className={`text-2xl font-bold ${colorClasses.title} mb-1`}>{name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{shortDescription}</p>
                </div>
            </div>

            {/* Contenido dinámico (visible en hover) */}
            <div
                className={`
                    absolute inset-0 p-6 flex flex-col justify-between
                    bg-white dark:bg-gray-800 rounded-lg opacity-0 transition-opacity duration-300
                    ${isHovered ? "opacity-100" : "opacity-0"}
                `}
            >
                <div className="flex-grow text-left">
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
                    className={`
                        mt-4 w-full py-2 text-white font-semibold rounded-md
                        ${colorClasses.button}
                    `}
                >
                    Usar herramienta
                </button>
            </div>
        </button>
    );
};

export default ToolCard;
