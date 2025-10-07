import React from "react";
import { Link } from "react-router-dom";

const ToolCard = ({ tool }) => {
    const toPath = `/${tool.category}/${tool.id}`;

    return (
        <Link
            to={toPath}
            className={`
                group relative flex flex-col items-center justify-center p-6 border-2 
                ${tool.colorClasses.border} rounded-xl overflow-hidden
                bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl 
                shadow-lg hover:shadow-2xl transition-all duration-500
                text-center transform hover:-translate-y-2 hover:scale-105
                before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:to-${tool.colorClasses.border.replace('border-', '')}/10
                before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100
                animate-scale-in
            `}
        >
            {/* Efecto de brillo en hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            {/* Contenido */}
            <tool.icon className={`text-5xl ${tool.colorClasses.icon} mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`} />
            <h3 className={`text-xl font-bold ${tool.colorClasses.title} mb-2 transition-colors duration-300`}>
                {tool.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                {tool.shortDescription}
            </p>
            
            {/* Indicador de hover */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${tool.colorClasses.border.replace('border-', 'from-')}-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        </Link>
    );
};

export default ToolCard;
