import React from "react";

function Footer() {
    return (
        <footer className="py-6 mt-12">
            <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} Hecho con ❤️ por colidom · Algunos derechos reservados, otros en desarrollo.
            </div>
        </footer>
    );
}

export default Footer;
