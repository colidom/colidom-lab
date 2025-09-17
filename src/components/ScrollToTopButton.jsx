// src/components/ScrollToTopButton.js
import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    // Muestra el botón cuando el scroll supera un umbral
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 500) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        // Limpieza del event listener
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    // Desplaza la página hacia el top suavemente
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`
                fixed bottom-4 right-4 z-50 p-3
                rounded-full
                // Colores para el botón en modos claro y oscuro
                bg-gray-700/80 dark:bg-gray-800/80 // Fondo con ligera transparencia
                text-white // Color de la flecha
                shadow-lg transition-opacity duration-300
                hover:bg-gray-600 dark:hover:bg-gray-700 // Cambio de color al pasar el ratón
                focus:outline-none focus:ring-2
                focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950
                border border-gray-600 dark:border-gray-700 // Borde sutil
                ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}
            `}
        >
            <FaArrowUp className="w-6 h-6" />
        </button>
    );
}
