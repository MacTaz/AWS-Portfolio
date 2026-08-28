import './App.css'
import { useEffect } from 'react'
import Sidebar from '@/components/SideBar/Sidebar.jsx'
import ContentSection from '@/components/ContentSection/ContentSection.jsx'
import AdminAnalyticsPanel from '@/components/admin/AdminAnalyticsPanel.jsx'
import { AdminProvider } from '@/context/AdminContext.jsx'

function App() {
  useEffect(() => {
    fetch("https://ioaty9p2d5.execute-api.us-east-1.amazonaws.com/log-visit", {
      method: "POST",
    }).catch((err) => console.error("Failed to log visit:", err));
  }, []);

  return (
    <AdminProvider>
      <div className="relative w-full min-h-screen md:h-screen font-sans bg-white overflow-x-clip">
        <div className="relative z-10 flex flex-col md:flex-row w-full max-w-[1440px] md:h-screen mx-auto">
          <Sidebar />
          <ContentSection />
        </div>
        <AdminAnalyticsPanel />
      </div>
    </AdminProvider>
  )
}

export default App