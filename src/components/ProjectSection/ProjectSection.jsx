import { useState } from "react";
import ProjectCard from "@/components/ProjectSection/ProjectCard";
import projectimage from "@/assets/sampleimage.png";

const projects = [
  { title: "Project 1", description: "Description for Project 1", image: projectimage, imageClass: "max-w-[500px] aspect-[4/2] object-cover" },
  { title: "Project 2", description: "Description for Project 2", image: projectimage, imageClass: "max-w-[500px] aspect-[4/2] object-cover" },
  { title: "Project 3", description: "Description for Project 3", image: projectimage, imageClass: "max-w-[500px] aspect-[4/2] object-cover" },
  { title: "Project 4", description: "Description for Project 4", image: projectimage, imageClass: "max-w-[500px] aspect-[4/2] object-cover" },
  { title: "Project 5", description: "Description for Project 5", image: projectimage, imageClass: "max-w-[500px] aspect-[4/2] object-cover" },
  { title: "Project 6", description: "Description for Project 6", image: projectimage, imageClass: "max-w-[500px] aspect-[4/2] object-cover" },
];

const education = [
  { title: "Bachelor of Science in Computer Science", description: "University · 2020 – 2024" },
  { title: "High School Diploma", description: "Senior High School · 2018 – 2020" },
];

const experience = [
  { title: "Frontend Developer", description: "Company A · 2024 – Present" },
  { title: "Game Developer Intern", description: "Studio B · 2023" },
];

const TABS = [
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
];

const contentMap = { projects, education, experience };

function ProjectSection() {
  const [activeTab, setActiveTab] = useState("projects");
  const [visible, setVisible] = useState(true);

  const switchTab = (id) => {
    if (id === activeTab) return;
    setVisible(false);
    setTimeout(() => {
      setActiveTab(id);
      setVisible(true);
    }, 500);
  };

  const items = contentMap[activeTab];

  return (
    <div className="flex flex-col w-full md:w-[65%] md:h-screen">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm px-6 md:px-12 lg:px-20 pt-16 md:pt-16 pb-4">
        <div className="flex items-center justify-center md:justify-start gap-6 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={[
                "font-inter text-2xl font-bold transition-all duration-200 cursor-pointer bg-transparent border-0 p-0",
                activeTab === tab.id
                  ? "opacity-100"
                  : "opacity-30 hover:opacity-60 hover:-translate-y-1",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 md:px-12 lg:px-20 pb-10">
        <div
          className="flex flex-col gap-10 pt-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          {activeTab === "projects"
            ? items.map((project, i) => <ProjectCard key={i} {...project} />)
            : items.map((item, i) => (
              <div key={i} className="flex flex-col gap-1 py-4 border-b border-gray-200 last:border-b-0">
                <p className="font-inter text-lg font-bold">{item.title}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectSection;
