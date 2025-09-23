export default function ThemeIcon({ selected }) {
    return (
        <div className="relative w-5 h-5 flex items-center">
            {/* Ícono de Sol (para tema claro) */}
            <svg
                className={`absolute w-5 h-5 transition-transform duration-200 ease-in-out ${
                    selected === "light" ? "scale-100" : "scale-0"
                } text-gray-900`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="12" cy="12" r="4" />
                <path d="M3 12h1m8-9v1m8 8h1m-9 8v1m-6.4-15.4l.7.7m12.1-.7l-.7.7m0 11.4l.7.7m-12.1-.7l-.7.7" />
            </svg>

            {/* Ícono de Luna (para tema oscuro) */}
            <svg
                className={`absolute w-5 h-5 transition-transform duration-200 ease-in-out ${
                    selected === "dark" ? "scale-100" : "scale-0"
                } text-gray-100`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>

            {/* Ícono de Sistema (para tema de sistema) */}
            <svg
                className={`absolute w-5 h-5 transition-transform duration-200 ease-in-out ${
                    selected === "system" ? "scale-100" : "scale-0"
                } text-gray-900 dark:text-gray-100`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M3 5a1 1 0 011-1h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V5z" />
                <path d="M7 20h10" />
                <path d="M9 16v4" />
                <path d="M15 16v4" />
            </svg>
        </div>
    );
}
