import { skillCategories as defaultCategories } from "@/components/ContentSection/portfolioData";

function SkillsSection({ categories = defaultCategories }) {
  return (
    <div
      style={{
        paddingTop: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      <p
        style={{
          fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
          fontSize: "1.5rem",
          fontWeight: 700,
          letterSpacing: "-0.01em",
          marginBottom: "0.25rem",
          textAlign: "center",
        }}
      >
        Skills
      </p>

      {categories.map((cat) => (
        <div key={cat.category} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {/* Category label */}
          <span
            style={{
              fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
              fontSize: "0.65rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(0,0,0,0.38)",
            }}
          >
            {cat.category}
          </span>

          {/* Pill chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {cat.items.map((item) => (
              <span
                key={item}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "rgba(0,0,0,0.72)",
                  background: "rgba(0,0,0,0.05)",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: "999px",
                  padding: "0.25rem 0.75rem",
                  letterSpacing: "0.01em",
                  whiteSpace: "nowrap",
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.05)")}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SkillsSection;
