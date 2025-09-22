import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar({ navItems, activeToolId, basePath }) {
    return (
        <div className="md:w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col items-start gap-4 shadow-md md:fixed md:top-0 md:left-0 md:bottom-0 z-10 pt-[8.0rem]">
            <div className="flex flex-col gap-2 w-full">
                {navItems.map((item) => (
                    <Link
                        key={item.id}
                        to={`${basePath}/${item.id}`}
                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors duration-200 text-left
                ${
                    activeToolId === item.id
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
                    >
                        <item.icon className="text-xl" />
                        <span className="text-base font-semibold">{item.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
