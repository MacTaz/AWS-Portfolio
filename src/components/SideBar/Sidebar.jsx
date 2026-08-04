import SocialLinks from './SocialLinks';

function Sidebar() {
  return (
    <div className="flex flex-col items-center md:items-start justify-start gap-16 md:gap-33 h-auto md:h-full w-full md:w-[35%] px-6 md:px-6 lg:px-12 xl:px-20 pt-16 pb-8 md:pt-15 md:pb-0 overflow-hidden">
      <p className="font-inter text-2xl font-bold text-center md:text-left">Mico Tazarte</p>
      <p className="font-inter text-xl font-bold text-center md:text-left text-gray-500 md:-mt-32">Mapúa University</p>

      <div className="max-w-[25ch] text-center md:text-left">
        <p>
          I'm a computer science student specializing in data science, with a strong interest in cloud computing and a creative outlet in game development. I bring leadership experience from my involvement in student organizations, along with hands-on experience from participating in AI hackathons. Explore this site for a closer look at my background, projects, and experience as I work toward a career in the field.
        </p>
      </div>

      <div className="mt-8 md:mt-auto md:mb-16">
        <SocialLinks />
      </div>
    </div>
  );
}
export default Sidebar;