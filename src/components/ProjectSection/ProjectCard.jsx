function ProjectCard({ title, description, image, imageClass }) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        <div className="flex flex-col items-center md:items-start justify-center">
            {/* Project Title & Description */}
            <p className="font-inter text-xl font-bold text-left">
                {title}
            </p>
            <p>
                {description}
            </p>
        </div>
        <img src={image} alt={title} className={imageClass} />
        {/* Project Image */}
    </div>
  );
}

export default ProjectCard;