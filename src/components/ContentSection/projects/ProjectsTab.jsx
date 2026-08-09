import { useState } from "react";
import ProjectCard from "@/components/ContentSection/projects/ProjectCard";
import ProjectModal from "@/components/ContentSection/projects/ProjectModal";
import { projects } from "@/components/ContentSection/portfolioData";

function ProjectsTab() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const handleOpenModal = (index) => {
    setModalIndex(index);
    setModalOpen(true);
  };

  return (
    <>
      {projects.map((item, i) => (
        <ProjectCard
          key={i}
          {...item}
          onMediaClick={() => handleOpenModal(i)}
        />
      ))}

      <ProjectModal
        isOpen={modalOpen}
        initialIndex={modalIndex}
        projects={projects}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

export default ProjectsTab;
