import { useState } from "react";
import ProjectCard from "@/components/ProjectSection/ProjectCard";
import lost_vid from "@/assets/VIDEOS/lost_vid.mp4";
import repurpose_vid from "@/assets/VIDEOS/repurpose_vid.mp4";
import taguan_vid from "@/assets/VIDEOS/taguan_vid.mp4";

const projects = [
  { title: "lost.", description: "Lost is a first-person survival horror game inspired by classic psychological horror experiences, where players must explore a dark, unsettling environment while evading a relentless entity. Developed using Unity, the game emphasizes immersive atmosphere, environmental storytelling, and suspense-driven gameplay through AI-powered enemy behavior, dynamic lighting, and sound design to create a tense and engaging player experience.", video: lost_vid, imageClass: "w-120", githubUrl: "https://github.com/", date: "2024" },
  { title: "RePurpose", description: "Led the development of RePurpose, a full-stack web application designed to connect donors with organizations through a category-based matching system. Built with secure user authentication and database management powered by Supabase, the platform provides a seamless and efficient donation experience while ensuring reliable data handling. The application was deployed on Vercel and managed using Git and GitHub, emphasizing scalability, maintainability, and collaborative software development practices.", video: repurpose_vid, imageClass: "w-120", githubUrl: "https://github.com/", date: "2024" },
  { title: "Tagu-Taguan", description: "Led the development of RePurpose, a full-stack web application designed to connect donors with organizations through a category-based matching system. Built with secure user authentication and database management powered by Supabase, the platform provides a seamless and efficient donation experience while ensuring reliable data handling. The application was deployed on Vercel and managed using Git and GitHub, emphasizing scalability, maintainability, and collaborative software development practices.", video: taguan_vid, imageClass: "w-120", githubUrl: "https://github.com/", date: "2024" },
  { title: "Cloud Website", description: "Led the development of RePurpose, a full-stack web application designed to connect donors with organizations through a category-based matching system. Built with secure user authentication and database management powered by Supabase, the platform provides a seamless and efficient donation experience while ensuring reliable data handling. The application was deployed on Vercel and managed using Git and GitHub, emphasizing scalability, maintainability, and collaborative software development practices.", video: lost_vid, imageClass: "w-120", githubUrl: "https://github.com/", date: "2024" },
];

const education = [
  {
    title: "Bachelor of Computer Science",
    subtitle: "Data Science Specialization | Mapua University",
    date: "2024 – Ongoing",
    bullets: [
      "Dean Lister across multiple terms with a strong and sustained GWA.",
      "DOST S&T Undergraduate Scholarship, Recipient of the DOST Scholarship.",
      "Relevant Coursework: Data Structures & Algorithms, Discrete Mathematics, Data Science, Software Engineering, Operating Systems, Data Communication & Networking, Computer Architecture, Quantitative Methods, Automata Theory."
    ],
    video: lost_vid,
    imageClass: "w-120"
  },
  {
    title: "Colegio De San Juan De Letran",
    subtitle: "Senior High School",
    bullets: [
      "Graduated with High Honors.",
      "Winning Best Research."
    ],
    video: lost_vid,
    imageClass: "w-120"
  },
];

const experience = [
  {
    title: "Internal Vice President",
    subtitle: "Student Organization",
    description: "Led team meetings, events, and internal communications; demonstrated strong collaboration and organizational skills.",
    media: [
      { video: lost_vid },
      { video: repurpose_vid },
      { video: taguan_vid },
    ],
    stacked: true
  },
  {
    title: "Converge Byte Forward Hackathon",
    subtitle: "National Hackathon | API, Database, and AI-focused",
    date: "August 2025",
    bullets: [
      "Developed SangAI, a web-based AI learning platform to improve digital literacy and export readiness of Philippine MSMEs through real-time AI guidance and localized mentorship.",
      "Integrated Converge AI APIs to deliver adaptive problem simulations that enhance user progression and confidence in digital skills."
    ],
    media: [
      { video: repurpose_vid },
      { video: lost_vid },
      { video: taguan_vid },
    ],
    stacked: true
  },
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
      <div className="flex-1 overflow-y-auto px-6 md:px-12 lg:px-20 pb-10 @container">
        <div
          className="flex flex-col gap-16 pt-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          {items.map((item, i) => <ProjectCard key={i} {...item} />)}
        </div>
      </div>
    </div>
  );
}

export default ProjectSection;
