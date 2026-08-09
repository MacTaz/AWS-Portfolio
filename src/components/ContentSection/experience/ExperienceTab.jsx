import ExperienceCard from "@/components/ContentSection/experience/ExperienceCard";
import { experience } from "@/components/ContentSection/portfolioData";

function ExperienceTab() {
  return (
    <>
      {experience.map((item, i) => (
        <ExperienceCard key={i} {...item} />
      ))}
    </>
  );
}

export default ExperienceTab;
