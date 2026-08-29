import { useState } from "react";

function CertificationsSlider({ items }) {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const total = items?.length || 0;
  if (total === 0) return null;

  const go = (index) => {
    if (fading || index === current) return;
    setFading(true);
    setTimeout(() => {
      setCurrent(index);
      setFading(false);
    }, 200);
  };

  const prev = () => go((current - 1 + total) % total);
  const next = () => go((current + 1) % total);

  const activeItem = items[current];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Sleek Sharp Glass Tab Selector */}
      {total > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {items.map((item, idx) => {
            const isActive = idx === current;
            // Extract concise label from title
            const words = item.title.split(" ");
            const shortTitle = words.length > 2 ? `${words[0]} ${words[1]}` : item.title;

            return (
              <button
                key={idx}
                onClick={() => go(idx)}
                className={[
                  "font-inter text-xs font-semibold uppercase tracking-wider px-3.5 py-2 border transition-colors cursor-pointer shrink-0 whitespace-nowrap",
                  isActive
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white/40 text-gray-600 border-white/80 backdrop-blur-md",
                ].join(" ")}
              >
                0{idx + 1}. {shortTitle}
              </button>
            );
          })}
        </div>
      )}

      {/* Unified Sharp Frosted Glass Card Container */}
      <div className="w-full flex flex-col gap-5 bg-white/60 backdrop-blur-xl p-6 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        {/* Top Header: Title, Subtitle, Date & Arrow Controls */}
        <div className="flex items-start justify-between w-full gap-4 flex-wrap">
          <div className="flex flex-col gap-1 max-w-[80%]">
            <span className="font-inter text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {activeItem.subtitle || "Certification"}
            </span>
            <h3 className="font-inter text-xl font-bold text-gray-900 leading-tight">
              {activeItem.title}
            </h3>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {activeItem.date && (
              <span className="font-inter text-xs font-semibold text-gray-500 border border-gray-200/80 bg-white/50 px-2.5 py-1">
                {activeItem.date}
              </span>
            )}
            {total > 1 && (
              <div className="flex items-center border border-white/80 bg-white/50 backdrop-blur-md">
                <button
                  onClick={prev}
                  aria-label="Previous certification"
                  className="p-1.5 text-gray-500 border-r border-white/80 cursor-pointer"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  onClick={next}
                  aria-label="Next certification"
                  className="p-1.5 text-gray-500 cursor-pointer"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Media Frame */}
        <div className="w-full aspect-video overflow-hidden bg-black/90 border border-white/80 shadow-inner relative flex items-center justify-center">
          <div
            style={{
              opacity: fading ? 0 : 1,
              transition: "opacity 0.2s ease",
              width: "100%",
              height: "100%",
            }}
          >
            {activeItem.video ? (
              <video
                key={activeItem.video}
                src={activeItem.video}
                className="w-full h-full object-contain"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : activeItem.image ? (
              <img
                src={activeItem.image}
                alt={activeItem.title}
                className="w-full h-full object-contain"
              />
            ) : null}
          </div>
        </div>

        {/* Description if present */}
        {activeItem.description && (
          <p className="font-inter font-medium text-sm leading-relaxed text-gray-700">
            {activeItem.description}
          </p>
        )}
      </div>
    </div>
  );
}

export default CertificationsSlider;
