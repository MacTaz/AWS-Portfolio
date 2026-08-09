import ContentCard from "@/components/ContentSection/ContentCard";
import CertificationsSection from "@/components/ContentSection/education/CertificationsSection";
import SkillsSection from "@/components/ContentSection/education/SkillsSection";
import { education } from "@/components/ContentSection/portfolioData";

function EducationTab() {
  return (
    <>
      {education.map((item, i) => (
        <ContentCard key={i} {...item} />
      ))}
      <CertificationsSection />
      <SkillsSection />
    </>
  );
}

export default EducationTab;
