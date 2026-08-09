import './App.css'
import { useEffect } from 'react'
import Sidebar from '@/components/SideBar/Sidebar.jsx'
import ContentSection from '@/components/ContentSection/ContentSection.jsx'
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
      <ContentSection />

    </div>
  )
}

export default App 
