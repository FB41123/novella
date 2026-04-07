import React, { createContext, useContext, useState } from 'react';

interface SiteSettings {
  siteName: string;
  description: string;
  logo: string;
  defaultLanguage: string;
  maintenanceMode: boolean;
}

interface SiteSettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
}

const defaultSettings: SiteSettings = {
  siteName: 'Novella',
  description: 'The best platform for Arabic novels.',
  logo: '/logo.png',
  defaultLanguage: 'ar',
  maintenanceMode: false,
};

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
