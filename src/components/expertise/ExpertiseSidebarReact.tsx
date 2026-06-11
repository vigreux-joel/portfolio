import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Icon } from "@udixio/ui-react";
import { iInfo } from "@udixio/icons-outlined-400/info";
import { iDevices } from "@udixio/icons-outlined-400/devices";
import { iApi } from "@udixio/icons-outlined-400/api";
import { iManufacturing } from "@udixio/icons-outlined-400/manufacturing";
import { iSelectWindow } from "@udixio/icons-outlined-400/select_window";

const initialLinks = [
    { id: "accueil", label: "Intro", icon: iInfo },
    { id: "front-end", label: "Front-end", icon: iDevices },
    { id: "multiplateforme", label: "Multiplateforme", icon: iSelectWindow },
    { id: "back-end", label: "Back-end", icon: iApi },
    { id: "philosophie", label: "Philosophie", icon: iManufacturing },
    { id: "faq", label: "FAQ", icon: iInfo },
];

export const ExpertiseSidebarReact = () => {
    const [activeId, setActiveId] = useState("accueil");
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [dynamicLinks, setDynamicLinks] = useState(initialLinks.map(l => ({ ...l, svgHtml: null as string | null })));

    useEffect(() => {
        const sections = document.querySelectorAll('#accueil, #front-end, #multiplateforme, #back-end, #philosophie, #faq');

        // Dynamic content update
        const updatedLinks = [...dynamicLinks];
        let hasChanges = false;

        initialLinks.forEach((link, index) => {
            const section = document.getElementById(link.id);
            if (section) {
                const h2 = section.querySelector('h2');
                if (h2) {
                    const overrideLabel = section.getAttribute('data-sidebar-label') || h2.getAttribute('data-sidebar-label');
                    const labelText = overrideLabel || (h2.textContent ? h2.textContent.trim() : null);
                    
                    if (labelText && labelText !== updatedLinks[index].label) {
                        updatedLinks[index].label = labelText;
                        hasChanges = true;
                    }
                }

                const lineSvg = section.querySelector('.w-6 svg');
                if (lineSvg) {
                    const newSvg = lineSvg.cloneNode(true) as SVGElement;
                    newSvg.setAttribute('class', 'w-5 h-5 fill-current');
                    const svgHtml = newSvg.outerHTML;
                    if (svgHtml !== updatedLinks[index].svgHtml) {
                        updatedLinks[index].svgHtml = svgHtml;
                        hasChanges = true;
                    }
                }
            }
        });

        if (hasChanges) {
            setDynamicLinks(updatedLinks);
        }

        // Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveId(entry.target.id);
                }
            });
        }, { rootMargin: "-40% 0px -60% 0px" });

        sections.forEach(section => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    const visibleId = hoveredId || activeId;

    return (
        <div className={`hidden 2xl:flex sticky top-0 h-screen flex-col justify-center px-8 z-40 shrink-0 group/sidebar transition-all duration-500 ${activeId === 'accueil' ? 'opacity-0 pointer-events-none -translate-x-4' : 'opacity-100 translate-x-0'}`}>
            {dynamicLinks.map(link => {
                if (link.id === "accueil") return null;
                const isActive = activeId === link.id;

                return (
                    <a
                        key={link.id}
                        href={`#${link.id}`}
                        className={`sidebar-link flex items-center gap-3 text-on-surface-variant hover:text-primary transition-colors relative py-2 ${isActive ? 'active' : ''}`}
                        onMouseEnter={() => {
                            if (timeoutRef.current) clearTimeout(timeoutRef.current);
                            setHoveredId(link.id);
                        }}
                        onMouseLeave={() => {
                            timeoutRef.current = setTimeout(() => {
                                setHoveredId(null);
                            }, 50); // slight delay to prevent flicker when crossing gaps
                        }}
                    >
                        <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center ring-1 transition-all duration-300 ${isActive ? 'bg-primary text-on-primary ring-primary/50 shadow-lg shadow-primary/20' : 'bg-surface-container-high ring-outline/20 hover:bg-surface-container-highest'}`}>
                            {link.svgHtml ? (
                                <div dangerouslySetInnerHTML={{ __html: link.svgHtml }} />
                            ) : (
                                <Icon icon={link.icon} className="w-5 h-5" />
                            )}
                        </div>

                        <AnimatePresence>
                            {visibleId === link.id && (
                                <motion.span
                                    layoutId="sidebar-tooltip"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="text-label-large absolute left-16 whitespace-nowrap bg-surface-container-highest text-on-surface px-4 py-2 rounded-xl shadow-md ring-1 ring-outline/20 hidden min-[1650px]:block group-hover/sidebar:block"
                                >
                                    {link.label}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </a>
                );
            })}
        </div>
    );
};
