import ProjectCard from "@/components/ProjectSection/ProjectCard";
import projectimage from "@/assets/sampleimage.png";
const projects = [
  {
    title: "Project 1",
    description: "Description for Project 1",
    image: projectimage,
    imageClass: 'max-w-[500px] aspect-[4/2] object-cover '
  },
  {
    title: "Project 2",
    description: "Description for Project 2",
    image: projectimage,
    imageClass: 'max-w-[500px] aspect-[4/2] object-cover '
  },
  {
    title: "Project 2",
    description: "Description for Project 2",
    image: projectimage,
    imageClass: 'max-w-[500px] aspect-[4/2] object-cover '
  },
  {
    title: "Project 2",
    description: "Description for Project 2",
    image: projectimage,
    imageClass: 'max-w-[500px] aspect-[4/2] object-cover '
  },
  {
    title: "Project 2",
    description: "Description for Project 2",
    image: projectimage,
    imageClass: 'max-w-[500px] aspect-[4/2] object-cover '
  },
  {
    title: "Project 2",
    description: "Description for Project 2",
    image: projectimage,
    imageClass: 'max-w-[500px] aspect-[4/2] object-cover '
  }
];

function ProjectSection() {
  return (
    <div className="flex flex-col items-center md:items-start md:w-2/3 md:h-screen md:overflow-y-auto">
      <p className="font-inter text-2xl font-bold mb-10 mt-20 items-center md:items-start">Projects</p>
      <div className="items-center flex flex-col gap-10">
        {projects.map((project, i) => (
          <ProjectCard key={i} {...project} />
        ))}
      </div>
    </div>
  );
}

export default ProjectSection;
