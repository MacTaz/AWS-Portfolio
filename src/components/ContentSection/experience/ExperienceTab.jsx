import ExperienceCard from "@/components/ContentSection/experience/ExperienceCard";
import { experience } from "@/components/ContentSection/portfolioData";

function ExperienceTab() {
  return (
    <div className="flex flex-col gap-16 md:gap-20 w-full max-w-[850px] mx-auto">
      {experience.map((item, i) => (
        <ExperienceCard key={i} {...item} />
      ))}
    </div>
  );
}

export default ExperienceTab;
