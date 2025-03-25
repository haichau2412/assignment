import { useContext } from "react";
import { DesignFormContext } from "./DesignContextProvider";

const useDesign = () => {
  const context = useContext(DesignFormContext);

  if (!context) {
    throw new Error("useDesigner must be used within a DesignFormProvider");
  }
  return context;
};

export default useDesign;
