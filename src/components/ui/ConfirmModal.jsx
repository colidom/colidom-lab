import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { MdWarning, MdClose } from "react-icons/md";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
    const modalRef = useRef(null);

    // Cerrar con Escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    // Cerrar al hacer clic fuera del modal
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Renderizar el modal usando un portal directamente en el body
    return createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center px-4 animate-fade-in">
            <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <MdWarning className="text-2xl text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {title}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        aria-label="Cerrar"
                    >
                        <MdClose className="text-xl text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl font-medium transition-all duration-300
                            bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                            border-2 border-gray-300 dark:border-gray-600
                            hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-5 py-2.5 rounded-xl font-medium transition-all duration-300
                            bg-gradient-to-r from-blue-500 to-cyan-500 text-white
                            shadow-md hover:shadow-xl hover:shadow-blue-500/50
                            hover:scale-105"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
