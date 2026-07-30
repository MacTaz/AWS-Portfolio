import './App.css'

import Sidebar from '@/components/SideBar/Sidebar.jsx'
import ProjectSection from '@/components/ProjectSection/ProjectSection.jsx'

function App() {

  return (
    <div className="flex flex-col md:flex-row w-full md:h-screen font-sans">    
      <Sidebar />
      <ProjectSection />

    </div>
  )
}

export default App 
