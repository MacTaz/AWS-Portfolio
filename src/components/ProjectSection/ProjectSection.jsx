import { useState } from "react";
import ProjectCard from "@/components/ProjectSection/ProjectCard";
import CertificationsSection from "@/components/ProjectSection/CertificationsSection";
import SkillsSection from "@/components/ProjectSection/SkillsSection";
import ProjectTabs from "@/components/ProjectSection/ProjectTabs";
import ProjectModal from "@/components/ProjectSection/ProjectModal";
import { contentMap, TABS, projects } from "@/components/ProjectSection/projectData";

function ProjectSection() {
  const [activeTab, setActiveTab] = useState("projects");
  const [visible, setVisible] = useState(true);

  // Modal state for video click
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const switchTab = (id) => {
    if (id === activeTab) return;
    setVisible(false);
    setTimeout(() => {
      setActiveTab(id);
      setVisible(true);
    }, 500);
  };

  const handleOpenModal = (index) => {
    setModalIndex(index);
    setModalOpen(true);
  };

  const items = contentMap[activeTab] || [];

  return (
    <div className="flex flex-col w-full md:w-[65%] md:h-screen">
      {/* Sticky header navigation */}
      <ProjectTabs tabs={TABS} activeTab={activeTab} onTabChange={switchTab} />

      {/* Scrollable content container */}
      <div className="flex-1 overflow-y-auto px-6 md:px-12 lg:px-20 pb-10 @container">
        <div
          className="flex flex-col gap-16 pt-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          {items.map((item, i) => (
            <ProjectCard
              key={i}
              {...item}
              onMediaClick={activeTab === "projects" ? () => handleOpenModal(i) : undefined}
            />
          ))}

          {activeTab === "education" && (
            <>
              <CertificationsSection />
              <SkillsSection />
            </>
          )}
        </div>
      </div>

      {/* Theater / Fullscreen Modal View for Projects */}
      <ProjectModal
        isOpen={modalOpen}
        initialIndex={modalIndex}
        projects={projects}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}

export default ProjectSection;
