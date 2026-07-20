import ProjectCard from "@/components/ProjectSection/ProjectCard";
import projectimage from "@/assets/sampleimage.png";
const projects = [
  {
    title: "Project 1",
    description: "Description for Project 1",
    image: projectimage,
    imageClass: 'w-full max-w-[500px] aspect-[4/3] object-cover md:w-1/2'
  },
  {
    title: "Project 2",
    description: "Description for Project 2",
    image: projectimage,
    imageClass: 'w-full max-w-[500px] aspect-[4/3] object-cover md:w-1/2'
  }
];

function ProjectSection() {
  return (
    <div className="flex flex-col items-center px-10 py-20 w-full md:w-2/3 md:h-screen md:overflow-y-auto">
      <p className="font-inter text-2xl font-bold mb-10">Projects</p>
      <div className="flex flex-col w-full max-w-5xl gap-10">
        {projects.map((project, i) => (
          <ProjectCard key={i} {...project} />
        ))}
      </div>
    </div>
  );
}

export default ProjectSection;