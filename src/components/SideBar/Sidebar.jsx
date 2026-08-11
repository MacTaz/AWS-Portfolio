import SocialLinks from './SocialLinks';

function Sidebar() {
  return (
    <div className="flex flex-col items-center md:items-start justify-start gap-8 md:gap-10 h-auto md:h-full w-full md:w-[35%] px-4 md:px-6 lg:px-8 pt-10 pb-6 md:pt-12 md:pb-0 overflow-hidden">
      <div>
        <p className="font-inter text-2xl font-bold text-center md:text-left">Mico Tazarte</p>
        <p className="font-inter text-xl font-bold text-center md:text-left text-gray-500 mt-1">Mapúa University</p>
      </div>

      <div className="max-w-[25ch] text-center md:text-left">
        <p>
          I'm a computer science student specializing in data science, with a strong interest in cloud computing and a creative outlet in game development. I bring leadership experience from my involvement in student organizations, along with hands-on experience from participating in AI hackathons. Explore this site for a closer look at my background, projects, and experience as I work toward a career in the field.
        </p>
      </div>

      <div className="mt-6 md:mt-auto md:mb-12">
        <SocialLinks />
      </div>
    </div>
  );
}
export default Sidebar;