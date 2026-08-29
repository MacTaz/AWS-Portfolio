import MediaSlider from "@/components/ContentSection/MediaSlider";
import { FaGithub, FaItchIo } from "react-icons/fa6";

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

      {/* Row directly under video: Date left (90px), Title centered (1fr), Icons right (90px) */}
      <div className="grid grid-cols-[90px_1fr_90px] items-center w-full px-0.5 mt-1">
        {/* Left: Date */}
        <div className="text-left">
          {date && <span className="text-xs text-gray-400 font-medium">{date}</span>}
        </div>

        {/* Center: Title & Subtitle */}
        <div className="flex items-center justify-center gap-1.5 text-center">
          <p className="font-inter text-lg font-bold text-gray-900">{title}</p>
          {subtitle && <span className="font-inter text-xs font-medium text-gray-500">({subtitle})</span>}
        </div>

        {/* Right: Action Icons */}
        <div className="flex items-center justify-end gap-2.5">
          {vercelUrl && (
            <a
              href={vercelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 hover:opacity-100 hover:-translate-y-0.5 transition-all duration-200"
              aria-label="Vercel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
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
              <FaItchIo className="w-4 h-4 text-gray-800" />
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
              <FaGithub className="w-4 h-4 text-gray-800" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
