import { useState } from "react";
import ContentTabs from "@/components/ContentSection/ContentTabs";
import ProjectsTab from "@/components/ContentSection/projects/ProjectsTab";
import EducationTab from "@/components/ContentSection/education/EducationTab";
import ExperienceTab from "@/components/ContentSection/experience/ExperienceTab";
import { TABS } from "@/components/ContentSection/portfolioData";

function ContentSection() {
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

  return (
    <div className="flex flex-col w-full md:w-[65%] md:h-screen">
      {/* Scrollable content container */}
      <div className="flex-1 md:overflow-y-auto no-scrollbar px-4 md:px-6 lg:px-8 pb-8 @container">
        {/* Sticky header navigation */}
        <ContentTabs tabs={TABS} activeTab={activeTab} onTabChange={switchTab} />

        <div
          className="flex flex-col gap-10 pt-4"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          {activeTab === "projects" && <ProjectsTab />}
          {activeTab === "education" && <EducationTab />}
          {activeTab === "experience" && <ExperienceTab />}
        </div>
      </div>
    </div>
  );
}

export default ContentSection;
