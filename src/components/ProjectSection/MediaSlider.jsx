import { useState } from "react";

// Each item in `media` is either { video } or { image, alt }
function MediaSlider({ media, aspectClass = "aspect-video" }) {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const total = media.length;
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

  const item = media[current];

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
    <div className="w-full flex flex-col gap-2">
      {/* Row: left arrow · video · right arrow */}
      <div className="flex items-stretch w-full rounded-lg overflow-hidden">
        {total > 1 && (
          <ArrowBtn onClick={prev} label="Previous media">
            <svg width="13" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </ArrowBtn>
        )}

        {/* Media frame — black bg so the fade goes dark, not white */}
        <div className={`flex-1 ${aspectClass} overflow-hidden bg-black`}>
          <div
            style={{
              opacity: fading ? 0 : 1,
              transition: "opacity 0.25s ease",
              width: "100%",
              height: "100%",
            }}
          >
            {item.video ? (
              <video
                key={item.video}
                src={item.video}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : item.image ? (
              <img
                src={item.image}
                alt={item.alt ?? "media"}
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>
        </div>

        {total > 1 && (
          <ArrowBtn onClick={next} label="Next media">
            <svg width="13" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </ArrowBtn>
        )}
      </div>

      {/* Dot indicators below */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-1.5">
          {media.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to media ${i + 1}`}
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

export default MediaSlider;
