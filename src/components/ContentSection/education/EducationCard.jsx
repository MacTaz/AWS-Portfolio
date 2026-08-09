function EducationCard({ title, subtitle, date, description, bullets }) {
  return (
    <div className="flex flex-col items-start justify-center w-full gap-1.5">
      <div className="flex items-baseline justify-between w-full flex-wrap gap-2">
        <p className="font-inter text-lg font-semibold text-gray-900">{title}</p>
        {date && <span className="text-xs text-gray-400 font-medium">{date}</span>}
      </div>

      {subtitle && (
        <p className="font-inter text-sm font-medium text-gray-500">
          {subtitle}
        </p>
      )}

      {description && (
        <p className="w-full text-justify text-sm text-gray-700 leading-relaxed mt-1">
          {description}
        </p>
      )}

      {bullets && bullets.length > 0 && (
        <ul className="w-full mt-1.5 list-disc list-inside space-y-1">
          {bullets.map((b, idx) => (
            <li key={idx} className="text-sm text-justify leading-relaxed text-gray-700">
              {b}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EducationCard;
