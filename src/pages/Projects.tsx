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
        const boundsRef = { current: null as null | { left: number; right: number; top: number; bottom: number } };
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
            const root = sectionRef.current;
            if (!root) return;

            const targets = root.querySelectorAll<HTMLElement>("[data-dynamic-contrast]");
            targets.forEach((el) => {
                const chars = el.querySelectorAll<HTMLElement>("[data-dynamic-char]");
                chars.forEach((charEl) => {
                    const rect = charEl.getBoundingClientRect();
                    const overlapLeft = Math.max(rect.left, boundsRef.current!.left);
                    const overlapRight = Math.min(rect.right, boundsRef.current!.right);
                    const overlapTop = Math.max(rect.top, boundsRef.current!.top);
                    const overlapBottom = Math.min(rect.bottom, boundsRef.current!.bottom);
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

        splitTargets();
        window.addEventListener("letter-bounds", onBounds);
        scrollContainer?.addEventListener("scroll", onScroll);
        window.addEventListener("resize", onScroll);

        return () => {
            window.removeEventListener("letter-bounds", onBounds);
            scrollContainer?.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
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
