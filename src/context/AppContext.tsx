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
  userData: boolean;
  setUserData: React.Dispatch<SetStateAction<boolean>>;
  loadUserProfileData: () => void;
  getDoctorsData: () => void;
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
  // const [token, setToken] = useState(
  //   localStorage.getItem("token") ? localStorage.getItem("token") : false
  // );
  const [token, setToken] = useState<string>(
    localStorage.getItem("token") || ""
  );

  const [userData, setUserData] = useState(false);

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
      if (data.success) {
        toast.success(data.message);
        setDoctors(data.doctors);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { token },
      });
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);

  const value: AppContextType = {
    doctors,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
    getDoctorsData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
