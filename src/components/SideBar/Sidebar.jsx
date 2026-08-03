import SocialLinks from './SocialLinks';

function Sidebar() {
  return (
    <div className="flex flex-col items-center md:items-start justify-start gap-16 md:gap-33 h-auto md:h-full w-full md:w-[35%] px-6 md:px-6 lg:px-12 xl:px-20 pt-16 pb-8 md:pt-15 md:pb-0 overflow-hidden">
      <p className="font-inter text-2xl font-bold text-center md:text-left">Mico Tazarte</p>
      <p className="font-inter text-xl font-bold text-center md:text-left text-gray-500 md:-mt-32">Mapúa University</p>

      <div className="max-w-[30ch] text-center md:text-left">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
          dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>

      <div className="mt-8 md:mt-auto md:mb-16">
        <SocialLinks />
      </div>
    </div>
  );
}
export default Sidebar;