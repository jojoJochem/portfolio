import { useEffect, useRef } from "react";
import FullPageSection from "@/components/fullPageSection";


const projects = [
    {
      title: "Laurierboom",
      description: "A lightweight full-stack web application built with Python and JavaScript, for registering and managing participation in chess tournaments in Amsterdam.",
      link: "https://laurierboom.com",
      linkdes: "View website",
    },    {
      title: "CloudSentinel",
      description: "Implementing AIOps for Enhanced Performance Anomaly Diagnosis and Response in Distributed Cloud Applications.",
      link: "https://github.com/jojoJochem/CloudSentinel",
      linkdes: "View on GitHub",
    },
    {
      title: "TerrApp",
      description: "A Python-based automation tool that converts structured Excel data into fully formatted Word reports.",
      link: "https://terrapp-production-ff8af6601f6c.herokuapp.com",
      linkdes: "View website",
    },
  ];

const Projects = () => {
    const sectionRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const onPhone = window.matchMedia("(max-width: 767px)").matches;
        const boundsRef = { current: null as null | { left: number; right: number; top: number; bottom: number } };
        const targetItems: { el: HTMLElement; chars: HTMLElement[] }[] = [];
        let isActive = true;
        let lastUpdate = 0;

        const splitTargets = () => {
            const root = sectionRef.current;
            if (!root) return;

            const targets = root.querySelectorAll<HTMLElement>("[data-dynamic-contrast]");
            targets.forEach((el) => {
                if (el.dataset.split === "true") return;
                const text = el.textContent ?? "";
                el.textContent = "";
                const frag = document.createDocumentFragment();

                Array.from(text).forEach((char) => {
                    const span = document.createElement("span");
                    span.className = "char";
                    span.dataset.dynamicChar = "true";
                    span.textContent = char === " " ? "\u00A0" : char;
                    frag.appendChild(span);
                });

                el.appendChild(frag);
                el.dataset.split = "true";
            });
        };

        const cacheTargets = () => {
            targetItems.length = 0;
            const root = sectionRef.current;
            if (!root) return;
            const targets = root.querySelectorAll<HTMLElement>("[data-dynamic-contrast]");
            targets.forEach((el) => {
                const chars = Array.from(el.querySelectorAll<HTMLElement>("[data-dynamic-char]"));
                targetItems.push({ el, chars });
            });
        };

        const clearAll = () => {
            targetItems.forEach(({ chars }) => {
                chars.forEach((charEl) => charEl.classList.remove("is-light"));
            });
        };

        let rafId: number | null = null;
        const scheduleUpdate = () => {
            if (rafId !== null) return;
            rafId = window.requestAnimationFrame(() => {
                rafId = null;
                updateTextColors();
            });
        };

        const updateTextColors = () => {
            if (!boundsRef.current) return;
            if (!isActive) return;
            const root = sectionRef.current;
            if (!root) return;

            const now = performance.now();
            const minInterval = onPhone ? 80 : 0;
            if (now - lastUpdate < minInterval) return;
            lastUpdate = now;

            const sectionRect = root.getBoundingClientRect();
            const bounds = boundsRef.current;
            const sectionOverlap =
                sectionRect.right > bounds.left &&
                sectionRect.left < bounds.right &&
                sectionRect.bottom > bounds.top &&
                sectionRect.top < bounds.bottom;

            if (!sectionOverlap) {
                clearAll();
                return;
            }

            targetItems.forEach(({ el, chars }) => {
                const elRect = el.getBoundingClientRect();
                const elOverlap =
                    elRect.right > bounds.left &&
                    elRect.left < bounds.right &&
                    elRect.bottom > bounds.top &&
                    elRect.top < bounds.bottom;

                if (!elOverlap) {
                    chars.forEach((charEl) => charEl.classList.remove("is-light"));
                    return;
                }

                chars.forEach((charEl) => {
                    const rect = charEl.getBoundingClientRect();
                    const overlapLeft = Math.max(rect.left, bounds.left);
                    const overlapRight = Math.min(rect.right, bounds.right);
                    const overlapTop = Math.max(rect.top, bounds.top);
                    const overlapBottom = Math.min(rect.bottom, bounds.bottom);
                    const intersects = overlapRight > overlapLeft && overlapBottom > overlapTop;
                    if (!intersects) {
                        charEl.classList.remove("is-light");
                        return;
                    }

                    const hit =
                        (window as Window & { __isLetterHit?: (x: number, y: number) => boolean })
                            .__isLetterHit?.(rect.left + rect.width / 2, rect.top + rect.height / 2) ?? false;
                    charEl.classList.toggle("is-light", hit);
                });
            });
        };

        const onBounds = (event: Event) => {
            const detail = (event as CustomEvent).detail as { left: number; right: number; top: number; bottom: number };
            boundsRef.current = detail;
            scheduleUpdate();
        };

        const scrollContainer = document.querySelector("main");
        const onScroll = () => scheduleUpdate();
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                isActive = Boolean(entry?.isIntersecting);
                if (!isActive) {
                    clearAll();
                } else {
                    scheduleUpdate();
                }
            },
            { root: scrollContainer ?? null, threshold: 0.15 }
        );

        splitTargets();
        cacheTargets();
        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }
        window.addEventListener("letter-bounds", onBounds);
        scrollContainer?.addEventListener("scroll", onScroll);
        window.addEventListener("resize", onScroll);

        return () => {
            window.removeEventListener("letter-bounds", onBounds);
            scrollContainer?.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            observer.disconnect();
            if (rafId !== null) {
                window.cancelAnimationFrame(rafId);
            }
        };
    }, []);

    return (
        <FullPageSection id="projects">
        <div ref={sectionRef} className="w-full">
            <h2 className="text-4xl font-semibold mb-6 dynamic-contrast" data-dynamic-contrast>
                Projects
            </h2>
            <div className="p-4 border rounded-xl shadow inline-block w-fit max-w-full">
            <div className="space-y-6">
                {projects.map((project) => (
                <div key={project.title} className="border p-4 rounded-xl shadow hover:scale-[1.02] transition-transform">
                    <h3 className="font-bold text-lg dynamic-contrast" data-dynamic-contrast>
                        {project.title}
                    </h3>
                    <p className="text-sm dynamic-contrast" data-dynamic-contrast>
                        {project.description}
                    </p>
                    <a
                        href={project.link}
                        target="_blank"
                        className="text-blue-500 mt-2 inline-block"
                        rel="noopener noreferrer"
                    >
                        {project.linkdes} →
                    </a>
                    </div>
                ))}
                </div>
            </div>
        </div>
        </FullPageSection>

    );
};

export default Projects;
