function ProjectCard({ title, description, image, imageClass }) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-5 md:gap-10 lg:gap-20 w-full">
        <div className="flex flex-col items-center md:items-start justify-center flex-1">
            {/* Project Title & Description */}
            <p className="font-inter text-xl font-bold text-left w-full">
                {title}
            </p>
            <p className="w-full">
                {description}
            </p>
        </div>
        <img src={image} alt={title} className={`${imageClass} w-full md:w-auto`} />
        {/* Project Image */}
    </div>
  );
}

export default ProjectCard;