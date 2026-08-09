import EducationCard from "@/components/ContentSection/education/EducationCard";
import CertificationsSection from "@/components/ContentSection/education/CertificationsSection";
import SkillsSection from "@/components/ContentSection/education/SkillsSection";
import { education } from "@/components/ContentSection/portfolioData";

function EducationTab() {
  return (
    <>
      {education.map((item, i) => (
        <EducationCard key={i} {...item} />
      ))}
      <CertificationsSection />
      <SkillsSection />
    </>
  );
}

export default EducationTab;
