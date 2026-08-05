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
    }, 250);
  };

  const prev = () => go((current - 1 + total) % total);
  const next = () => go((current + 1) % total);

  const activeItem = items[current];

  const ArrowBtn = ({ onClick, label, children }) => (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex-shrink-0 flex items-center justify-center w-10 self-stretch bg-white hover:bg-gray-100 transition-colors duration-200 cursor-pointer border-0 group/arrow"
    >
      <span className="text-gray-400 group-hover/arrow:text-gray-800 transition-colors duration-200">
        {children}
      </span>
    </button>
  );

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Row: left arrow · certificate image container · right arrow */}
      <div className="flex items-stretch w-full rounded-lg overflow-hidden border border-gray-100 shadow-sm">
        {total > 1 && (
          <ArrowBtn onClick={prev} label="Previous certification">
            <svg width="13" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </ArrowBtn>
        )}

        {/* Certificate Image Frame */}
        <div className="flex-1 aspect-video overflow-hidden bg-black flex items-center justify-center">
          <div
            style={{
              opacity: fading ? 0 : 1,
              transition: "opacity 0.25s ease",
              width: "100%",
              height: "100%",
            }}
          >
            {activeItem.video ? (
              <video
                key={activeItem.video}
                src={activeItem.video}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : activeItem.image ? (
              <img
                src={activeItem.image}
                alt={activeItem.title}
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>
        </div>

        {total > 1 && (
          <ArrowBtn onClick={next} label="Next certification">
            <svg width="13" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </ArrowBtn>
        )}
      </div>

      {/* Certification details below the image */}
      <div className="flex flex-col items-start gap-0.5 px-1">
        <div className="flex items-center justify-between w-full">
          <p className="font-inter text-lg font-bold text-gray-900">
            {activeItem.title}
          </p>
          {activeItem.date && (
            <span className="text-xs text-gray-400 font-medium">
              {activeItem.date}
            </span>
          )}
        </div>
        {activeItem.subtitle && (
          <p className="font-inter text-sm font-semibold text-gray-500">
            {activeItem.subtitle}
          </p>
        )}
        {activeItem.description && (
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
            {activeItem.description}
          </p>
        )}
      </div>

      {/* Navigation dots */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-1">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to certification ${i + 1}`}
              className={[
                "rounded-full transition-all duration-300 cursor-pointer border-0 p-0",
                i === current
                  ? "w-3.5 h-1.5 bg-gray-800"
                  : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-500",
              ].join(" ")}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CertificationsSlider;
