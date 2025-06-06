// AppContext.tsx
import React, { createContext, type ReactNode } from "react";
import { doctors } from "../assets/assets";
import type { DoctorRESP } from "../data/doctors/doctors.response";

interface AppContextType {
  doctors: DoctorRESP[];
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

// Define props type for provider
interface AppContextProviderProps {
  children: ReactNode;
}

const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
  const value: AppContextType = { doctors };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
