function EducationCard({ title, subtitle, date, description, bullets }) {
  return (
    <div className="w-full flex flex-col gap-3 bg-white/60 backdrop-blur-xl p-6 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex items-baseline justify-between w-full flex-wrap gap-2">
        <h3 className="font-inter text-xl font-bold text-gray-900">{title}</h3>
        {date && (
          <span className="font-inter font-medium text-sm text-gray-500">
            {date}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="font-inter font-medium text-sm text-gray-600">
          {subtitle}
        </p>
      )}

      {description && (
        <p className="font-inter font-medium text-sm leading-relaxed text-justify mt-1">
          {description}
        </p>
      )}

      {bullets && bullets.length > 0 && (
        <div className="flex flex-col gap-2 mt-1">
          {bullets.map((b, idx) => (
            <div key={idx} className="flex items-start gap-2 font-inter font-medium text-sm">
              <span className="text-gray-400 shrink-0">•</span>
              <span className="leading-relaxed">{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EducationCard;
