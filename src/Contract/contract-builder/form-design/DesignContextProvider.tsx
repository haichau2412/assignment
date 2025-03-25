import { createContext } from "react";

interface FormDesignContext {}

export const DesignFormContext = createContext<FormDesignContext | null>(null);

const DesignFormContextProvider = ({ children }: { children: React.ReactNode }) => {
  return <DesignFormContext.Provider value={{}}>{children}</DesignFormContext.Provider>;
};

export default DesignFormContextProvider;
