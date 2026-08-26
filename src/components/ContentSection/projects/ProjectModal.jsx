import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import itchio from "@/assets/itchio.svg";

function ProjectModal({ isOpen, initialIndex = 0, projects = [], onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [offset, setOffset] = useState(0);
  const [enableTransition, setEnableTransition] = useState(false);
  const total = projects?.length || 0;
  const isNavigatingRef = useRef(false);

  const SLIDE_DURATION = 600; // ms
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

    // 1. Slide out
    setEnableTransition(true);
    setOffset(exitOffset);

    setTimeout(() => {
      // 2. Snap to opposite side with new content (no transition)
      setEnableTransition(false);
      setCurrentIndex((prev) => (prev + dir + total) % total);
      setOffset(enterOffset);

      // 3. Slide new content in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnableTransition(true);
          setOffset(0);
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

  // Touch swipe handler for mobile
  const touchStartYRef = useRef(null);
  const touchStartXRef = useRef(null);

  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      touchStartYRef.current = e.touches[0].clientY;
      touchStartXRef.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartYRef.current === null || touchStartXRef.current === null) return;
    if (!e.changedTouches || e.changedTouches.length === 0) return;

    const endY = e.changedTouches[0].clientY;
    const endX = e.changedTouches[0].clientX;

    const deltaY = touchStartYRef.current - endY;
    const deltaX = touchStartXRef.current - endX;

    const SWIPE_THRESHOLD = 30; // Minimum px distance to trigger a swipe

    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > SWIPE_THRESHOLD) {
      if (deltaY > 0) {
        nextProject();
      } else {
        prevProject();
      }
    }

    touchStartYRef.current = null;
    touchStartXRef.current = null;
  };

  const handleTouchCancel = () => {
    touchStartYRef.current = null;
    touchStartXRef.current = null;
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
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-hidden touch-none"
      style={{
        background: "rgba(255, 255, 255, 0.55)",
      }}
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
            style={{ opacity: 0.3 }}
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
          {/* Close Button — matches admin panel X button style */}
          <button
            onClick={onClose}
            aria-label="Close project view"
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 30,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#594c49",
              padding: 8,
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#161217"}
            onMouseLeave={e => e.currentTarget.style.color = "#594c49"}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Video / Media Area — responsive flex sizing: fills available space by default, shrinks only if text requires more room */}
          <div className="w-full flex-1 min-h-0 flex-shrink aspect-video md:aspect-square md:w-auto md:h-full relative overflow-hidden md:flex-initial md:min-w-[280px]">
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

          {/* Right Panel — frosted glass white, matching admin panel aesthetic */}
          <div
            className="w-full md:w-[320px] lg:w-[420px] flex-shrink-0 md:flex-none h-auto md:h-full p-4 md:p-6 lg:p-8 flex flex-col justify-between overflow-hidden relative z-20 min-h-0"
            style={{
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(10px) saturate(140%)",
              WebkitBackdropFilter: "blur(10px) saturate(140%)",
            }}
          >
            <div className="flex flex-col gap-3 md:gap-4">
              {/* Date top-left, no counter */}
              {currentProject.date && (
                <span className="text-xs font-medium" style={{ color: "#594c49" }}>{currentProject.date}</span>
              )}

              <h2 className="font-inter text-xl md:text-3xl font-bold tracking-tight leading-tight" style={{ color: "#161217" }}>
                {currentProject.title}
              </h2>

              {currentProject.subtitle && (
                <p className="font-inter text-sm font-semibold" style={{ color: "#594c49" }}>
                  {currentProject.subtitle}
                </p>
              )}

              {currentProject.description && (
                <p className="text-sm leading-relaxed text-justify mt-1 md:mt-2" style={{ color: "#2a2229" }}>
                  {currentProject.description}
                </p>
              )}
            </div>

            {/* Bottom Action Links & Scroll Indicator */}
            <div className="mt-4 pt-4 md:mt-8 md:pt-6 flex flex-col gap-4 flex-shrink-0" style={{ borderTop: "1px solid rgba(22,18,23,0.14)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {currentProject.vercelUrl && (
                    <a
                      href={currentProject.vercelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:-translate-y-0.5 transition-all"
                      style={{ color: "#161217", opacity: 0.6 }}
                      onMouseEnter={e => e.currentTarget.style.opacity = 1}
                      onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
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
                      className="hover:-translate-y-0.5 transition-all"
                      style={{ opacity: 0.6 }}
                      onMouseEnter={e => e.currentTarget.style.opacity = 1}
                      onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
                      aria-label="itch.io"
                    >
                      <img src={itchio} alt="itch.io" className="w-5 h-5" style={{ filter: "none" }} />
                    </a>
                  )}
                  {currentProject.githubUrl && (
                    <a
                      href={currentProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:-translate-y-0.5 transition-all"
                      style={{ color: "#161217", opacity: 0.6 }}
                      onMouseEnter={e => e.currentTarget.style.opacity = 1}
                      onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
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
