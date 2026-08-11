import { TABS as defaultTabs } from "@/components/ContentSection/portfolioData";

function ContentTabs({ tabs = defaultTabs, activeTab, onTabChange }) {
  return (
    <div className="sticky top-0 z-30 bg-white/75 backdrop-blur-md border-b border-gray-100/80 px-4 md:px-6 lg:px-8 pt-6 md:pt-8 pb-3 -mx-4 md:-mx-6 lg:-mx-8">
      <div className="flex items-center justify-center gap-6 flex-wrap w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={[
              "font-inter text-2xl font-bold transition-all duration-200 cursor-pointer bg-transparent border-0 p-0",
              activeTab === tab.id
                ? "opacity-100"
                : "opacity-30 hover:opacity-60 hover:-translate-y-1",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ContentTabs;
