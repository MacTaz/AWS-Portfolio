import { skillCategories as defaultCategories } from "@/components/ContentSection/portfolioData";

function SkillsSection({ categories = defaultCategories }) {
  return (
    <div className="flex flex-col gap-5 pt-6 border-t border-gray-100 mt-2">
      <h2 className="font-inter text-xl font-bold text-gray-900 tracking-tight">
        Skills
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.category}
            className="flex flex-col gap-2.5 bg-white/60 backdrop-blur-xl p-5 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <span className="font-inter font-bold text-xs text-gray-500 uppercase tracking-wider">
              {cat.category}
            </span>

            <p className="font-inter font-medium text-sm leading-relaxed">
              {cat.items.join(" · ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillsSection;
