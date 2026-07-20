import SocialLinks from './SocialLinks';

function Sidebar() {
  return (
    <div className="flex flex-col justify-center gap-16 md:gap-12 -mt-20  h-screen md:h-full w-full md:w-1/3 ml-10 mr-5 md:ml-20 md:mr-20">
  <p className="font-inter text-2xl font-bold">Mico Tazarte</p>

  <div className="mr-20 max-w-2xl">
    <p max-w-65ch >Lorem ipsum dolor sit amet, ...orem ipsum dolor sit amet, ...orem ipsum dolor sit amet, 
      ...orem ipsum dolor sit amet, ...orem ipsum dolor sit amet, ...orem ipsum dolor sit amet, 
      ...orem ipsum dolor sit amet, ...orem ipsum dolor sit amet, ...orem ipsum dolor sit amet, 
      ...orem ipsum dolor sit amet, ...orem ipsum dolor sit amet, ...orem ipsum dolor sit amet, ...</p>
  </div>

  <div className="mt-8 -ml-20 md:ml-0 md:mt-70 md:items-start">
    <SocialLinks />
  </div>
</div>
  );
}
export default Sidebar;