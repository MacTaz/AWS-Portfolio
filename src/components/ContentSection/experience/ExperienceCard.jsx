import MediaSlider from "@/components/ContentSection/MediaSlider";
import itchio from "@/assets/itchio.svg";

function ExperienceCard({
  title,
  subtitle,
  description,
  bullets,
  media,
  video,
  image,
  githubUrl,
  vercelUrl,
  itchUrl,
  date,
}) {
  const media1 = media && media.length > 0 ? media[0] : null;
  const media2 = media && media.length > 1 ? media[1] : (media && media.length > 0 ? media[0] : null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 gap-3.5 w-full">
      {/* Box 1: Top Left - 40% (4/10) */}
      <div className="md:col-span-4 flex flex-col justify-between bg-white/60 backdrop-blur-xl p-5 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex flex-col gap-2">
          {date && (
            <span className="font-inter text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {date}
            </span>
          )}
          <h3 className="font-inter text-lg font-bold text-gray-900 leading-snug">
            {title}
          </h3>
          {subtitle && (
            <p className="font-inter text-xs font-medium text-gray-500">
              {subtitle}
            </p>
          )}
          {description && (
            <p className="font-inter font-medium text-sm leading-relaxed mt-1">
              {description}
            </p>
          )}
        </div>

        {(githubUrl || vercelUrl || itchUrl) && (
          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-200/60">
            {vercelUrl && (
              <a
                href={vercelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 hover:-translate-y-0.5 transition-all duration-200"
                aria-label="Vercel"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 22.525H0l12-21.05 12 21.05z" />
                </svg>
              </a>
            )}
            {itchUrl && (
              <a
                href={itchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 hover:-translate-y-0.5 transition-all duration-200"
                aria-label="itch.io"
              >
                <img src={itchio} alt="itch.io" className="w-[18px] h-[18px]" />
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 hover:-translate-y-0.5 transition-all duration-200"
                aria-label="GitHub"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Box 2: Top Right - 60% (6/10) */}
      <div className="md:col-span-6 w-full aspect-square overflow-hidden bg-black/90 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative flex items-center justify-center">
        {media1 ? (
          media1.video ? (
            <video src={media1.video} className="w-full h-full object-cover" autoPlay loop muted playsInline />
          ) : media1.image ? (
            <img src={media1.image} alt={title} className="w-full h-full object-cover" />
          ) : null
        ) : video ? (
          <video src={video} className="w-full h-full object-cover" autoPlay loop muted playsInline />
        ) : image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : null}
      </div>

      {/* Box 3: Bottom Left - 60% (6/10) */}
      <div className="md:col-span-6 w-full aspect-square overflow-hidden bg-black/90 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative flex items-center justify-center">
        {media2 ? (
          media2.video ? (
            <video src={media2.video} className="w-full h-full object-cover" autoPlay loop muted playsInline />
          ) : media2.image ? (
            <img src={media2.image} alt={title} className="w-full h-full object-cover" />
          ) : null
        ) : media1 ? (
          media1.video ? (
            <video src={media1.video} className="w-full h-full object-cover" autoPlay loop muted playsInline />
          ) : media1.image ? (
            <img src={media1.image} alt={title} className="w-full h-full object-cover" />
          ) : null
        ) : null}
      </div>

      {/* Box 4: Bottom Right - 40% (4/10) */}
      <div className="md:col-span-4 flex flex-col justify-start bg-white/60 backdrop-blur-xl p-5 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        {bullets && bullets.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            <span className="font-inter font-bold text-xs text-gray-500 uppercase tracking-wider">
              Highlights
            </span>
            <ul className="flex flex-col gap-2">
              {bullets.map((b, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-gray-400 shrink-0">•</span>
                  <span className="font-inter font-medium text-sm leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            <span className="font-inter font-bold text-xs text-gray-500 uppercase tracking-wider">
              Details
            </span>
            <p className="font-inter font-medium text-sm leading-relaxed">
              {description || "Key responsibilities and organizational achievements."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExperienceCard;
