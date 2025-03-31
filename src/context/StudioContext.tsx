import { createContext, useContext, useState, ReactNode } from "react";
import { Studio } from "@/Utils/Types";

interface StudioContextType {
  studio: Studio;
  toggleStudio: () => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider = ({ children }: { children: ReactNode }) => {
  const [studio, setStudio] = useState<Studio>("lavanda_purple");

  const toggleStudio = () => {
    setStudio((prev) => 
      (prev === "lavanda_purple" ? "lavanda_red" : "lavanda_purple"))
  } ;

  return (
    <StudioContext.Provider value={{ studio, toggleStudio}}>
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = () => {
  const context = useContext(StudioContext);
  if(!context) {
    throw new Error("Error with using context")
  }

  return context;
}