import MediaSlider from "@/components/ContentSection/MediaSlider";
import itchio from "@/assets/itchio.svg";

function ProjectCard({
  title,
  subtitle,
  media,
  video,
  image,
  imageClass,
  githubUrl,
  vercelUrl,
  itchUrl,
  date,
  onMediaClick,
}) {
  const hasMedia = Boolean((media && media.length > 0) || video || image);
  const containerWidthClass = imageClass || "max-w-[700px]";

  return (
    <div className={`flex flex-col w-full ${containerWidthClass} mx-auto gap-2`}>
      {hasMedia && (
        <div
          onClick={onMediaClick}
          className="w-full max-w-full overflow-hidden bg-black aspect-square flex items-center justify-center cursor-zoom-in relative"
        >
          {media && media.length > 0 ? (
            <MediaSlider media={media} aspectClass="aspect-square" />
          ) : video ? (
            <video
              src={video}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>
      )}

      {/* Row directly under video: Date left, Title centered, Icons right */}
      <div className="flex items-center justify-between w-full px-0.5 mt-1 gap-2">
        {/* Left: Date */}
        <div className="min-w-[60px] text-left">
          {date && <span className="text-xs text-gray-400 font-medium">{date}</span>}
        </div>

        {/* Center: Title & Subtitle */}
        <div className="flex-1 flex items-center justify-center gap-1.5 text-center">
          <p className="font-inter text-lg font-bold text-gray-900">{title}</p>
          {subtitle && <span className="font-inter text-xs font-medium text-gray-500">({subtitle})</span>}
        </div>

        {/* Right: Action Icons */}
        <div className="min-w-[60px] flex items-center justify-end gap-3">
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
      </div>
    </div>
  );
}

export default ProjectCard;
