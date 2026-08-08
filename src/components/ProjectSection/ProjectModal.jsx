import { useState, useEffect, useRef } from "react";
import itchio from "@/assets/itchio.svg";

function ProjectModal({ isOpen, initialIndex = 0, projects = [], onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const total = projects?.length || 0;
  const isScrollingRef = useRef(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const nextProject = () => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevProject = () => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  // Scroll handler for switching projects on mouse wheel or trackpad scroll
  const handleWheel = (e) => {
    if (isScrollingRef.current) return;
    if (Math.abs(e.deltaY) > 25) {
      isScrollingRef.current = true;
      if (e.deltaY > 0) {
        nextProject();
      } else {
        prevProject();
      }
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 500);
    }
  };

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "PageDown") nextProject();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") prevProject();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, currentIndex, total]);

  if (!isOpen || total === 0) return null;

  const currentProject = projects[currentIndex] || {};

  return (
    <div
      onWheel={handleWheel}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/90 backdrop-blur-xl"
    >
      {/* Blurred background video layer */}
      {currentProject.video && (
        <video
          key={`bg-${currentIndex}-${currentProject.video}`}
          src={currentProject.video}
          className="absolute inset-0 w-full h-full object-cover filter blur-3xl opacity-40 scale-110 pointer-events-none"
          autoPlay
          loop
          muted
          playsInline
        />
      )}

      {/* Outer Modal Container */}
      <div className="relative z-10 flex flex-col md:flex-row w-full h-full max-w-7xl max-h-[88vh] mx-4 bg-transparent border border-white/10 shadow-2xl overflow-hidden backdrop-blur-md">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 text-white/70 hover:text-white bg-black/60 hover:bg-black/90 transition-colors cursor-pointer border-0 rounded-full"
          aria-label="Close project view"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Video Player Centered (No black background box) */}
        <div className="flex-1 flex items-center justify-center p-6 relative">
          <div className="w-full h-full max-w-3xl aspect-square md:aspect-video flex items-center justify-center overflow-hidden shadow-2xl">
            {currentProject.video ? (
              <video
                key={`main-${currentIndex}-${currentProject.video}`}
                src={currentProject.video}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : currentProject.image ? (
              <img src={currentProject.image} alt={currentProject.title} className="w-full h-full object-cover" />
            ) : null}
          </div>
        </div>

        {/* Right Panel: Black Background with White Text Description */}
        <div className="w-full md:w-[40%] bg-black text-white p-8 flex flex-col justify-between overflow-y-auto border-t md:border-t-0 md:border-l border-white/10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50 font-mono tracking-wider uppercase">
                Project {currentIndex + 1} of {total}
              </span>
              {currentProject.date && (
                <span className="text-xs text-white/50 font-medium">{currentProject.date}</span>
              )}
            </div>

            <h2 className="font-inter text-3xl font-bold text-white tracking-tight">
              {currentProject.title}
            </h2>

            {currentProject.subtitle && (
              <p className="font-inter text-sm font-semibold text-white/70">
                {currentProject.subtitle}
              </p>
            )}

            {currentProject.description && (
              <p className="text-white/80 text-sm leading-relaxed text-justify mt-2">
                {currentProject.description}
              </p>
            )}
          </div>

          {/* Bottom Action Links & Scroll Indicator */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {currentProject.vercelUrl && (
                  <a
                    href={currentProject.vercelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-70 hover:opacity-100 hover:-translate-y-0.5 transition-all text-white"
                    aria-label="Vercel"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 22.525H0l12-21.05 12 21.05z" />
                    </svg>
                  </a>
                )}
                {currentProject.itchUrl && (
                  <a
                    href={currentProject.itchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-70 hover:opacity-100 hover:-translate-y-0.5 transition-all"
                    aria-label="itch.io"
                  >
                    <img src={itchio} alt="itch.io" className="w-5 h-5 filter invert" />
                  </a>
                )}
                {currentProject.githubUrl && (
                  <a
                    href={currentProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-70 hover:opacity-100 hover:-translate-y-0.5 transition-all text-white"
                    aria-label="GitHub"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                )}
              </div>

              {/* Scroll Hint */}
              <span className="text-[11px] text-white/40 font-mono flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
                Scroll to switch
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectModal;
