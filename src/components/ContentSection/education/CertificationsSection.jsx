import CertificationsSlider from "@/components/ContentSection/education/CertificationsSlider";
import { certifications as defaultCertifications } from "@/components/ContentSection/portfolioData";

function CertificationsSection({ items = defaultCertifications }) {
  return (
    <div className="flex flex-col gap-4 pt-6 border-t border-gray-100 mt-2">
      <h2 className="font-inter text-xl font-bold text-gray-900 tracking-tight">
        Certifications
      </h2>
      <CertificationsSlider items={items} />
    </div>
  );
}

export default CertificationsSection;
