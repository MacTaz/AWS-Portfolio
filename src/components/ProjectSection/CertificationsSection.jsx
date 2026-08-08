import CertificationsSlider from "@/components/ProjectSection/CertificationsSlider";
import { certifications as defaultCertifications } from "@/components/ProjectSection/projectData";

function CertificationsSection({ items = defaultCertifications }) {
  return (
    <div className="flex flex-col gap-4 pt-4">
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
        Certifications
      </p>
      <CertificationsSlider items={items} />
    </div>
  );
}

export default CertificationsSection;
