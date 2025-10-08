import React from "react";
import { Link } from "react-router-dom";

const ToolCard = ({ tool }) => {
    const toPath = `/${tool.category}/${tool.id}`;
    
    // Mapeo de colores para usar en estilos inline
    const colorMap = {
        'border-blue-500': { 
            from: 'rgba(59, 130, 246, 0.1)', 
            to: 'rgba(59, 130, 246, 0.05)',
            shadow: 'rgba(59, 130, 246, 0.5)',
            solid: 'rgb(59, 130, 246)',
            border: 'rgba(59, 130, 246, 0.2)'
        },
        'border-orange-500': { 
            from: 'rgba(249, 115, 22, 0.1)', 
            to: 'rgba(249, 115, 22, 0.05)',
            shadow: 'rgba(249, 115, 22, 0.5)',
            solid: 'rgb(249, 115, 22)',
            border: 'rgba(249, 115, 22, 0.2)'
        },
        'border-purple-500': { 
            from: 'rgba(168, 85, 247, 0.1)', 
            to: 'rgba(168, 85, 247, 0.05)',
            shadow: 'rgba(168, 85, 247, 0.5)',
            solid: 'rgb(168, 85, 247)',
            border: 'rgba(168, 85, 247, 0.2)'
        },
        'border-pink-500': { 
            from: 'rgba(236, 72, 153, 0.1)', 
            to: 'rgba(236, 72, 153, 0.05)',
            shadow: 'rgba(236, 72, 153, 0.5)',
            solid: 'rgb(236, 72, 153)',
            border: 'rgba(236, 72, 153, 0.2)'
        },
        'border-red-500': { 
            from: 'rgba(239, 68, 68, 0.1)', 
            to: 'rgba(239, 68, 68, 0.05)',
            shadow: 'rgba(239, 68, 68, 0.5)',
            solid: 'rgb(239, 68, 68)',
            border: 'rgba(239, 68, 68, 0.2)'
        },
        'border-rose-500': { 
            from: 'rgba(244, 63, 94, 0.1)', 
            to: 'rgba(244, 63, 94, 0.05)',
            shadow: 'rgba(244, 63, 94, 0.5)',
            solid: 'rgb(244, 63, 94)',
            border: 'rgba(244, 63, 94, 0.2)'
        },
        'border-teal-500': { 
            from: 'rgba(20, 184, 166, 0.1)', 
            to: 'rgba(20, 184, 166, 0.05)',
            shadow: 'rgba(20, 184, 166, 0.5)',
            solid: 'rgb(20, 184, 166)',
            border: 'rgba(20, 184, 166, 0.2)'
        },
        'border-emerald-500': { 
            from: 'rgba(16, 185, 129, 0.1)', 
            to: 'rgba(16, 185, 129, 0.05)',
            shadow: 'rgba(16, 185, 129, 0.5)',
            solid: 'rgb(16, 185, 129)',
            border: 'rgba(16, 185, 129, 0.2)'
        },
        'border-indigo-500': { 
            from: 'rgba(99, 102, 241, 0.1)', 
            to: 'rgba(99, 102, 241, 0.05)',
            shadow: 'rgba(99, 102, 241, 0.5)',
            solid: 'rgb(99, 102, 241)',
            border: 'rgba(99, 102, 241, 0.2)'
        },
        'border-green-500': { 
            from: 'rgba(34, 197, 94, 0.1)', 
            to: 'rgba(34, 197, 94, 0.05)',
            shadow: 'rgba(34, 197, 94, 0.5)',
            solid: 'rgb(34, 197, 94)',
            border: 'rgba(34, 197, 94, 0.2)'
        },
        'border-amber-500': { 
            from: 'rgba(245, 158, 11, 0.1)', 
            to: 'rgba(245, 158, 11, 0.05)',
            shadow: 'rgba(245, 158, 11, 0.5)',
            solid: 'rgb(245, 158, 11)',
            border: 'rgba(245, 158, 11, 0.2)'
        },
        'border-cyan-500': { 
            from: 'rgba(6, 182, 212, 0.1)', 
            to: 'rgba(6, 182, 212, 0.05)',
            shadow: 'rgba(6, 182, 212, 0.5)',
            solid: 'rgb(6, 182, 212)',
            border: 'rgba(6, 182, 212, 0.2)'
        },
    };
    
    const colors = colorMap[tool.colorClasses.border] || colorMap['border-blue-500'];

    return (
        <Link
            to={toPath}
            className="group relative block h-full animate-scale-in"
        >
            {/* Contenedor principal con altura fija */}
            <div className={`
                relative flex flex-col h-full min-h-[280px] p-6 rounded-2xl overflow-hidden
                bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl
                border-2 ${tool.colorClasses.border}
                shadow-lg
                transition-all duration-500 ease-out
                transform hover:-translate-y-2 hover:scale-[1.02]
            `}
            style={{
                boxShadow: 'var(--tw-shadow)',
                '--tw-shadow': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.setProperty('--tw-shadow', `0 25px 50px -12px ${colors.shadow}`);
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.setProperty('--tw-shadow', '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)');
            }}
            >
                {/* Gradiente de fondo */}
                <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: `linear-gradient(135deg, ${colors.from} 0%, transparent 50%, ${colors.to} 100%)`
                    }}
                />
                
                {/* Efecto de brillo animado */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                
                {/* Orbe de color decorativo */}
                <div 
                    className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: `radial-gradient(circle, ${colors.from} 0%, ${colors.to} 100%)`
                    }}
                />
                
                {/* Contenido - con z-index para estar sobre los efectos */}
                <div className="relative z-10 flex flex-col h-full">
                    {/* Icono con efecto de elevación */}
                    <div className="flex items-center justify-center mb-4">
                        <div 
                            className="p-4 rounded-2xl border transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                            style={{
                                background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
                                borderColor: colors.border,
                                boxShadow: 'var(--icon-shadow)',
                                '--icon-shadow': '0 0 0 transparent'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.setProperty('--icon-shadow', `0 10px 30px ${colors.shadow}`);
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.setProperty('--icon-shadow', '0 0 0 transparent');
                            }}
                        >
                            <tool.icon className={`text-5xl ${tool.colorClasses.icon} transition-transform duration-300 group-hover:scale-110`} />
                        </div>
                    </div>
                    
                    {/* Título */}
                    <h3 className={`
                        text-xl font-bold mb-3 text-center
                        ${tool.colorClasses.title}
                        transition-all duration-300
                        group-hover:scale-105
                    `}>
                        {tool.name}
                    </h3>
                    
                    {/* Descripción con altura fija */}
                    <div className="flex-1 flex items-start justify-center mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300 text-center line-clamp-3 leading-relaxed">
                            {tool.shortDescription}
                        </p>
                    </div>
                    
                    {/* Botón con gradiente */}
                    <div className="flex justify-center">
                        <div 
                            className="px-5 py-2 rounded-xl text-white text-sm font-semibold shadow-md transition-all duration-300 group-hover:scale-105"
                            style={{
                                background: `linear-gradient(90deg, ${colors.solid}, ${colors.solid})`,
                                boxShadow: 'var(--button-shadow)',
                                '--button-shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.setProperty('--button-shadow', `0 20px 25px -5px ${colors.shadow}`);
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.setProperty('--button-shadow', '0 4px 6px -1px rgba(0, 0, 0, 0.1)');
                            }}
                        >
                            Ver herramienta →
                        </div>
                    </div>
                </div>
                
                {/* Barra de progreso inferior animada */}
                <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
                    <div 
                        className="h-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out"
                        style={{
                            background: `linear-gradient(90deg, ${colors.solid}, ${colors.from}, ${colors.solid})`
                        }}
                    />
                </div>
                
                {/* Corner accent */}
                <div 
                    className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-[3rem]"
                    style={{
                        background: `linear-gradient(135deg, ${colors.from} 0%, transparent 100%)`
                    }}
                />
            </div>
        </Link>
    );
};

export default ToolCard;
