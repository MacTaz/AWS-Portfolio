import SocialLinks from './SocialLinks';

function Sidebar() {
  return (
    <div className="flex flex-col max-w-2xl mt-5 ml-5">
      <p className="font-inter text-2xl font-bold ">Mico Tazarte</p>
      <p max-w-65ch >Lorem ipsum dolor sit amet, ...orem ipsum dolor sit amet, ...orem ipsum dolor sit amet,
        ...orem ipsum dolor sit amet, ...orem ipsum dolor sit amet, ...orem ipsum dolor sit amet,
        ...orem ipsum dolor sit amet, ...orem ipsum dolor sit amet, ...orem ipsum dolor sit amet,
        ...orem ipsum dolor sit amet, ...orem ipsum dolor sit amet, ...orem ipsum dolor sit amet, ...</p>
      <div className="mt-8 -ml-20 md:ml-0 md:mt-70 md:items-start">
        <SocialLinks />
      </div>
    </div>
  );
}
export default Sidebar;