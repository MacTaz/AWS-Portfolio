import SocialLinks from './SocialLinks';

function Sidebar() {
  return (
    <div className="flex w-1/3 flex-col ml-20 mt-20"> 
          {/*LEFT SIDE*/}
    
            <div className="flex flex-col items-start justify-center">
              {/* NAME HEADER */}
              <p className="font-inter text-2xl font-bold">Mico Tazarte</p>
            </div>
    
          <div className="flex flex-col mt-10 mr-60 justify-self-center">
              {/* DESCRIPTION */}
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip 
                    ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
    
         <SocialLinks />
    </div>
  );
}
export default Sidebar;