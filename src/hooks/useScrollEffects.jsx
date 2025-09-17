import { useState, useEffect, useRef } from "react";

export const useScrollEffects = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("inicio");
    const isClickScrolling = useRef(false);

    useEffect(() => {
        const onScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const isMobile = window.innerWidth <= 768;
        const margin = isMobile ? "-20% 0px -20% 0px" : "-25% 0px -25% 0px";

        const observer = new IntersectionObserver(
            (entries) => {
                if (isClickScrolling.current) return;

                let bestMatch = null;
                let maxArea = 0;

                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const intersectionRect = entry.intersectionRect;
                        const area = intersectionRect.width * intersectionRect.height;

                        if (area > maxArea) {
                            maxArea = area;
                            bestMatch = entry;
                        }
                    }
                });

                if (bestMatch) {
                    setActiveSection(bestMatch.target.id);
                } else if (window.scrollY === 0) {
                    setActiveSection("inicio");
                }
            },
            {
                rootMargin: margin,
                threshold: Array.from({ length: 101 }, (_, i) => i / 100),
            }
        );

        const sections = document.querySelectorAll("section[id]");
        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    const handleNavClick = (e, sectionId) => {
        e.preventDefault();
        isClickScrolling.current = true;
        setActiveSection(sectionId);

        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        } else {
            console.error(`Error: Elemento con id "${sectionId}" no encontrado.`);
        }

        setTimeout(() => {
            isClickScrolling.current = false;
        }, 1000);
    };

    return { isScrolled, activeSection, handleNavClick };
};
