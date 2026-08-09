import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import itchio from "@/assets/itchio.svg";

function ProjectModal({ isOpen, initialIndex = 0, projects = [], onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [offset, setOffset] = useState(0);
  const [enableTransition, setEnableTransition] = useState(false);
  const [bgOpacity, setBgOpacity] = useState(0.3);
  const total = projects?.length || 0;
  const isNavigatingRef = useRef(false);

  const SLIDE_DURATION = 600; // ms
  const BG_FADE_DURATION = 400; // ms — bg fades faster than slide
  const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const navigate = useCallback((dir) => {
    if (isNavigatingRef.current || total === 0) return;
    isNavigatingRef.current = true;

    // dir=1 → next (scroll down): exit upward, enter from below
    const exitOffset = dir === 1 ? -100 : 100;
    const enterOffset = dir === 1 ? 100 : -100;

    // 1. Start: slide out + fade bg to black
    setEnableTransition(true);
    setOffset(exitOffset);
    setBgOpacity(0);

    setTimeout(() => {
      // 2. Snap to opposite side with new content (no transition)
      setEnableTransition(false);
      setCurrentIndex((prev) => (prev + dir + total) % total);
      setOffset(enterOffset);

      // 3. Slide new content in + fade bg back in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnableTransition(true);
          setOffset(0);
          setBgOpacity(0.3);
          setTimeout(() => {
            isNavigatingRef.current = false;
          }, SLIDE_DURATION);
        });
      });
    }, SLIDE_DURATION);
  }, [total]);

  const nextProject = useCallback(() => navigate(1), [navigate]);
  const prevProject = useCallback(() => navigate(-1), [navigate]);

  // Scroll handler
  const handleWheel = (e) => {
    if (Math.abs(e.deltaY) > 25) {
      if (e.deltaY > 0) nextProject();
      else prevProject();
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
  }, [isOpen, nextProject, prevProject, onClose]);

  if (!isOpen || total === 0) return null;

  const currentProject = projects[currentIndex] || {};

  // Applied to the whole modal card (video + text + close button all slide together)
  const slideStyle = {
    transform: `translateY(${offset}%)`,
    transition: enableTransition ? `transform ${SLIDE_DURATION}ms ${EASE}` : "none",
  };

  return createPortal(
    <div
      onWheel={handleWheel}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl overflow-hidden"
    >
      {/* Full-screen sliding wrapper — blurred bg + modal card slide together as one unit */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={slideStyle}
      >
        {/* Blurred background video — no key so it never remounts mid-slide */}
        {currentProject.video && (
          <video
            src={currentProject.video}
            className="absolute inset-0 w-full h-full object-cover filter blur-3xl scale-110 pointer-events-none"
            style={{
              opacity: bgOpacity,
              transition: `opacity ${BG_FADE_DURATION}ms ease`,
            }}
            autoPlay
            loop
            muted
            playsInline
          />
        )}

        {/* Modal Card */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative z-10 flex flex-col md:flex-row mx-4 md:mx-6 lg:mx-0 w-[calc(100vw-2rem)] md:w-[92vw] lg:w-auto h-[85vh] md:h-[75vh] lg:h-[82vh] max-h-[720px] max-w-[1050px] overflow-hidden gap-3 md:gap-4 lg:gap-6"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2 text-white/70 hover:text-white bg-black/60 hover:bg-black/90 transition-colors cursor-pointer border border-white/10"
            aria-label="Close project view"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Video / Media Area — responsive sizing */}
          <div className="w-full flex-1 md:flex-initial aspect-video md:aspect-square md:w-auto md:h-full relative overflow-hidden flex-shrink min-h-[140px] md:min-w-[280px]">
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
              <img
                src={currentProject.image}
                alt={currentProject.title}
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>

          {/* Right Panel */}
          <div className="w-full md:w-[320px] lg:w-[420px] flex-shrink-0 flex-1 md:flex-none h-auto md:h-full bg-black text-white p-4 md:p-6 lg:p-8 flex flex-col justify-between overflow-hidden relative z-20 min-h-0">
            <div className="flex flex-col gap-4">
              {/* Date top-left, no counter */}
              {currentProject.date && (
                <span className="text-xs text-white/50 font-medium">{currentProject.date}</span>
              )}

              <h2 className="font-inter text-2xl md:text-3xl font-bold text-white tracking-tight">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ProjectModal;
