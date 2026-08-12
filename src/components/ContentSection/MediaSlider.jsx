import { useState } from "react";

// Each item in `media` is either { video } or { image, alt }
function MediaSlider({ media, aspectClass = "aspect-video" }) {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const total = media?.length || 0;
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

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Media frame */}
      <div className={`w-full ${aspectClass} overflow-hidden bg-black relative`}>
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

      {/* Switcher under the image */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-3 py-1">
          <button
            onClick={prev}
            aria-label="Previous media"
            className="p-1 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="flex items-center gap-1.5">
            {media.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Go to media ${i + 1}`}
                className={[
                  "rounded-full transition-all duration-300 cursor-pointer border-0 p-0",
                  i === current
                    ? "w-4 h-1.5 bg-gray-800"
                    : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-500",
                ].join(" ")}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Next media"
            className="p-1 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default MediaSlider;
