function ProjectCard({ title, description, video, image, imageClass, githubUrl, date }) {
  return (
    <div className="flex flex-col @[700px]:flex-row items-center justify-between gap-5 @[700px]:gap-16 w-full">
      {/* Left: Title, Description, Date */}
      <div className="flex flex-col items-center @[700px]:items-start justify-center flex-1 w-full">
        <p className="font-inter text-xl font-bold text-center @[700px]:text-left w-full">
          {title}
        </p>
        <p className="w-full text-justify mt-2">
          {description}
        </p>
      </div>
      {/* Right: Image + GitHub Link */}
      <div className="flex flex-col flex-shrink-0">
        <div className={`${imageClass} aspect-square overflow-hidden`}>
          {video ? (
            <video
              src={video}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img src={image} alt={title} className="w-full h-full object-cover" />
          )}
        </div>
        <div className="flex items-center justify-between mt-1">
          {date && (
            <p className="text-xs text-gray-400">{date}</p>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 hover:opacity-100 hover:-translate-y-0.5 transition-all duration-200 ml-auto"
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
