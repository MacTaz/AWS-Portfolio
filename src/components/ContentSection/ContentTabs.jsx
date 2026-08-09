import { TABS as defaultTabs } from "@/components/ContentSection/portfolioData";

function ContentTabs({ tabs = defaultTabs, activeTab, onTabChange }) {
  return (
    <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm px-6 md:px-12 lg:px-20 pt-16 md:pt-16 pb-4">
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
