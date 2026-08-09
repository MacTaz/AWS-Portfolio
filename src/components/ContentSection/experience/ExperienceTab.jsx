import ContentCard from "@/components/ContentSection/ContentCard";
import { experience } from "@/components/ContentSection/portfolioData";

function ExperienceTab() {
  return (
    <>
      {experience.map((item, i) => (
        <ContentCard key={i} {...item} />
      ))}
    </>
  );
}

export default ExperienceTab;
