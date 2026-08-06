import './App.css'
import { useEffect } from 'react'
import Sidebar from '@/components/SideBar/Sidebar.jsx'
import ProjectSection from '@/components/ProjectSection/ProjectSection.jsx'
import BackgroundText from '@/components/BackgroundText/BackgroundText.jsx'

function App() {
  useEffect(() => {
    fetch("https://ioaty9p2d5.execute-api.us-east-1.amazonaws.com/log-visit", {
      method: "POST",
    }).catch((err) => console.error("Failed to log visit:", err));
  }, []);

  return (
    <div className="relative flex flex-col md:flex-row w-full md:h-screen font-sans">
      <BackgroundText />
      <Sidebar />
      <ProjectSection />

    </div>
  )
}

export default App 
