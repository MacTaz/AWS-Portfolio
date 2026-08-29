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
      <div className="relative w-full min-h-screen md:h-screen font-sans bg-slate-50/40 overflow-x-clip">
        {/* Soft background ambient glows for iOS glassmorphism blur */}
        <div className="fixed -top-40 -left-40 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="fixed top-1/3 -right-40 w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="fixed -bottom-40 left-1/3 w-[500px] h-[500px] bg-sky-100/40 rounded-full blur-3xl pointer-events-none z-0" />

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