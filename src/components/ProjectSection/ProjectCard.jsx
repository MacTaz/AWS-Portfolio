function ProjectCard({ title, description, image, imgClass }) {
  return (
    <div className="flex flex-row items-center justify-center">
        <div className="flex flex-col items-center justify-center"> 
            {/*Project Description & Title */}
            <p className=" flex font-inter text-left">
                {title}
            </p>
            <p>
                {description}
            </p>
        </div>
        <img src={image} alt="Project Image" className={`w-150 h-100 m-20 ${imgClass}`} />
        {/* Project Image */}
    </div>
  );
}

export default ProjectCard;