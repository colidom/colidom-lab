import React from "react";
import { Link } from "react-router-dom";

const ToolCard = ({ tool }) => {
    const toPath = `/${tool.category}/${tool.id}`;

    return (
        <Link
            to={toPath}
            className={`
                flex flex-col items-center justify-center p-6 border-2 
                ${tool.colorClasses.border} rounded-xl
                // 💡 Clases para un efecto más cristalino
                bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg 
                shadow-lg hover:shadow-xl transition-all duration-300
                text-center transform hover:-translate-y-1
            `}
        >
            <tool.icon className={`text-4xl ${tool.colorClasses.icon} mb-4`} />
            <h3 className={`text-xl font-bold ${tool.colorClasses.title} mb-2`}>{tool.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{tool.shortDescription}</p>
        </Link>
    );
};

export default ToolCard;
