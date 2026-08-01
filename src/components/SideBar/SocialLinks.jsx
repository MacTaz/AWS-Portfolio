import facebook from '@/assets/facebook.svg'
import linkedin from '@/assets/linkedin.svg'
import itchio from '@/assets/itchio.svg'

function SocialLinks() {
  return (
    <div className="flex flex-col items-center md:items-start w-full mt-10">
      <div className="flex flex-row gap-4">
        <a href="https://www.facebook.com/micoangelocruz.tazarte" target="_blank" rel="noopener noreferrer"
          className="opacity-70 hover:opacity-100 hover:-translate-y-1 transition-all duration-200">
          <img src={facebook} alt="Facebook" className="w-6 h-6" />
        </a>
        <a href="https://www.linkedin.com/in/mico-angelo-tazarte-7439b1278/" target="_blank" rel="noopener noreferrer"
          className="opacity-70 hover:opacity-100 hover:-translate-y-1 transition-all duration-200">
          <img src={linkedin} alt="LinkedIn" className="w-6 h-6" />
        </a>
        <a href="https://mactaz.itch.io/" target="_blank" rel="noopener noreferrer"
          className="opacity-70 hover:opacity-100 hover:-translate-y-1 transition-all duration-200">
          <img src={itchio} alt="Itch.io" className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
}

export default SocialLinks;