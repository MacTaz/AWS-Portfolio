import './App.css'

import Sidebar from '@/components/SideBar/Sidebar.jsx'
import ProjectSection from '@/components/ProjectSection/ProjectSection.jsx'
import BackgroundText from '@/components/BackgroundText/BackgroundText.jsx'

function App() {

  return (
    <div className="relative flex flex-col md:flex-row w-full md:h-screen font-sans">    
      <BackgroundText />
      <Sidebar />
      <ProjectSection />

    </div>
  )
}

export default App 
