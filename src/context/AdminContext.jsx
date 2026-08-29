import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [showPassword, setShowPassword] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [initialData, setInitialData] = useState(null);

  const openPasswordGate = useCallback(() => setShowPassword(true), []);
  const cancelPassword = useCallback(() => setShowPassword(false), []);

  const onAuthSuccess = useCallback((data, pwd) => {
    if (data) setInitialData(data);
    if (pwd) setAdminPassword(pwd);
    setShowPassword(false);
    setPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => setPanelOpen(false), []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setShowPassword(false);
        setPanelOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <AdminContext.Provider
      value={{
        showPassword,
        panelOpen,
        adminPassword,
        initialData,
        openPasswordGate,
        cancelPassword,
        onAuthSuccess,
        closePanel,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return ctx;
}
