import EducationCard from "@/components/ContentSection/education/EducationCard";
import CertificationsSection from "@/components/ContentSection/education/CertificationsSection";
import SkillsSection from "@/components/ContentSection/education/SkillsSection";
import { education } from "@/components/ContentSection/portfolioData";

function EducationTab() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-[700px] mx-auto">
      <div className="flex flex-col gap-6">
        {education.map((item, i) => (
          <EducationCard key={i} {...item} />
        ))}
      </div>

      <CertificationsSection />
      <SkillsSection />
    </div>
  );
}

export default EducationTab;
