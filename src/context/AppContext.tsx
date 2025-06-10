// AppContext.tsx
import axios from "axios";
import React, {
  createContext,
  useEffect,
  useState,
  type ReactNode,
  type SetStateAction,
} from "react";
import { toast } from "react-toastify";
import type { DoctorRESP } from "../data/doctors/doctors.response";

// Define the shape of the context
interface AppContextType {
  doctors: DoctorRESP[];
  currencySymbol: string;
  token: string;
  setToken: React.Dispatch<SetStateAction<string>>;
  backendUrl: string;
}

// Create the context
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Props for provider component
interface AppContextProviderProps {
  children: ReactNode;
}

// Provider component
const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
  const [doctors, setDoctors] = useState<DoctorRESP[]>([]);
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
      if (data.success) {
        toast.success(data.message);
        setDoctors(data.doctors);
      }
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      toast.error("Failed to load doctors.");
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  const value: AppContextType = {
    doctors,
    currencySymbol,
    token,
    setToken,
    backendUrl,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
