import { FaFacebookF, FaLinkedinIn, FaItchIo, FaEnvelope, FaLock } from 'react-icons/fa6'
import { useAdmin } from '@/context/AdminContext.jsx'

function SocialLinks() {
  const { openPasswordGate, panelOpen } = useAdmin()

  return (
    <div className="flex flex-col items-center md:items-start w-full mt-10">
      <div className="flex flex-row gap-2.5 items-center flex-wrap">
        <a
          href="https://www.facebook.com/micoangelocruz.tazarte"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 flex items-center justify-center bg-white/60 backdrop-blur-md border border-white/80 text-gray-600 hover:text-gray-900 transition-colors shadow-[0_4px_16px_rgb(0,0,0,0.03)]"
          title="Facebook"
          aria-label="Facebook"
        >
          <FaFacebookF className="w-4 h-4" />
        </a>
        <a
          href="https://www.linkedin.com/in/mico-angelo-tazarte-7439b1278/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 flex items-center justify-center bg-white/60 backdrop-blur-md border border-white/80 text-gray-600 hover:text-gray-900 transition-colors shadow-[0_4px_16px_rgb(0,0,0,0.03)]"
          title="LinkedIn"
          aria-label="LinkedIn"
        >
          <FaLinkedinIn className="w-4 h-4" />
        </a>
        <a
          href="https://mactaz.itch.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 flex items-center justify-center bg-white/60 backdrop-blur-md border border-white/80 text-gray-600 hover:text-gray-900 transition-colors shadow-[0_4px_16px_rgb(0,0,0,0.03)]"
          title="Itch.io"
          aria-label="Itch.io"
        >
          <FaItchIo className="w-4 h-4" />
        </a>
        <a
          href="mailto:micotazarte@gmail.com"
          className="w-10 h-10 flex items-center justify-center bg-white/60 backdrop-blur-md border border-white/80 text-gray-600 hover:text-gray-900 transition-colors shadow-[0_4px_16px_rgb(0,0,0,0.03)]"
          title="micotazarte@gmail.com"
          aria-label="Email"
        >
          <FaEnvelope className="w-4 h-4" />
        </a>
        {!panelOpen && (
          <button
            type="button"
            onClick={openPasswordGate}
            className="w-10 h-10 flex items-center justify-center bg-white/60 backdrop-blur-md border border-white/80 text-gray-600 hover:text-gray-900 transition-colors shadow-[0_4px_16px_rgb(0,0,0,0.03)] cursor-pointer"
            title="Admin access"
            aria-label="Open admin analytics"
          >
            <FaLock className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default SocialLinks;