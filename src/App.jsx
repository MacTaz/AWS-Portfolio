import './App.css'

import Sidebar from '@/components/Sidebar.jsx'
import projectimage from './assets/sampleimage.png'

function App() {

  return (
    <div className="flex flex-row h-screen w-screen font-sans"> 
    {/*Left - Right Layout*/}
    
      <Sidebar />



      <div className="flex w-2/3 flex-col ml-20 mt-20">
        {/*Right Side*/}

        <p className="font-inter text-2xl font-bold justify-center mb-10">Projects</p>
        {/*Right Side Header*/}

        <div className="flex flex-col overflow-y-auto">
        {/* PROJECTS OVERFLOW */}

          <div className="flex flex-row items-center justify-center">
            <div className="flex flex-col items-center justify-center"> 
              {/*Project Description & Title */}
              <p className=" flex font-inter text-left">Project</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip 
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
            <img src={projectimage} alt="Project Image" className="w-150 h-100 m-20" />
            {/* Project Image */}
          </div>

          <div className="flex flex-row items-center justify-center">
            <div className="flex flex-col items-center justify-center"> 
              {/*Project Description & Title */}
              <p className=" flex font-inter">Project</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip 
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
            <img src={projectimage} alt="Project Image" className="w-80 h-80 m-20" />
            {/* Project Image */}
          </div>
        </div>
     
    </div>
  </div>
  )
}

export default App 
