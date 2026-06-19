"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

interface GoogleExportContextType {
  link: string;
  setLink: (link: string) => void;
}

const GoogleExportContext = createContext<GoogleExportContextType>({ link: "", setLink: () => {} });

export function GoogleExportProvider({ children }: { children: ReactNode }) {
  const [link, setLink] = useState("");

  return (
    <GoogleExportContext.Provider value={{ link, setLink }}>
      {children}
    </GoogleExportContext.Provider>
  );
}

export function useGoogleExport() {
  return useContext(GoogleExportContext);
}
