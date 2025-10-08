import React from "react";
import { MdFavorite, MdEmail, MdCode } from "react-icons/md";
import { FaGithub, FaLinkedin } from "react-icons/fa";

function Footer() {
    return (
        <footer className="relative mt-20 border-t border-gray-200 dark:border-gray-800">
            {/* Gradiente decorativo */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            
            <div className="container mx-auto px-6 md:px-20 max-w-7xl">
                {/* Contenido principal del footer */}
                <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sección Sobre el proyecto */}
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center justify-center md:justify-start gap-2">
                            <MdCode className="text-blue-500" />
                            Colidom-Lab
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            Un laboratorio de herramientas útiles para desarrolladores e ingenieros IT. 
                            Construido con React y Tailwind CSS.
                        </p>
                    </div>

                    {/* Sección Enlaces */}
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                            Enlaces
                        </h3>
                        <div className="flex flex-col gap-2 text-sm">
                            <a 
                                href="https://github.com/colidom" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 inline-flex items-center justify-center gap-2"
                            >
                                <FaGithub />
                                GitHub
                            </a>
                            <a 
                                href="https://www.linkedin.com/in/colidom" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 inline-flex items-center justify-center gap-2"
                            >
                                <FaLinkedin />
                                LinkedIn
                            </a>
                            <a 
                                href="mailto:colidom@outlook.com"
                                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 inline-flex items-center justify-center gap-2"
                            >
                                <MdEmail />
                                Contacto
                            </a>
                        </div>
                    </div>

                    {/* Sección Stats/Info */}
                    <div className="text-center md:text-right">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                            Estadísticas
                        </h3>
                        <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center justify-center md:justify-end gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span>13 herramientas activas</span>
                            </div>
                            <div className="flex items-center justify-center md:justify-end gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                <span>3 categorías</span>
                            </div>
                            <div className="flex items-center justify-center md:justify-end gap-2">
                                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                                <span>100% Open Source</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Separador */}
                <div className="border-t border-gray-200 dark:border-gray-800" />

                {/* Barra inferior */}
                <div className="py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <span>&copy; {new Date().getFullYear()} Hecho con</span>
                        <MdFavorite className="text-red-500 animate-pulse" />
                        <span>por <span className="font-semibold text-blue-600 dark:text-blue-400">colidom</span></span>
                    </div>
                    
                    <div className="text-xs">
                        <span>Algunos derechos reservados, otros en desarrollo</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
