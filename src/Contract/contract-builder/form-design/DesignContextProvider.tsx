import { createContext, useCallback, useState } from "react";
import createZustandStore from "./store/useZustandStore";

type ZustandStore = ReturnType<typeof createZustandStore>;

const zustandStoreMap = new Map<string, ZustandStore>();

interface FormInfo {
  formId: string;
  formLabel: string;
}

interface FormDesignContext {
  forms: FormInfo[];
  addForm: (data: FormInfo) => void;
  removeFormInfo: (formId: string) => void;
  updateFormInfo: (data: FormInfo) => void;
  getStore: (formId: string) => ZustandStore | null;
  createStore: (formId: string, formLabel: string) => void;
}

export const DesignFormContext = createContext<FormDesignContext | null>(null);

const DesignFormContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [forms, setForms] = useState<FormInfo[]>([]);

  const addForm = useCallback((data: FormInfo) => {
    setForms((prevForms) => [...prevForms, data]);
  }, []);

  const removeFormInfo = useCallback((formId: string) => {
    setForms((prevForms) => prevForms.filter((form) => form.formId !== formId));
    zustandStoreMap.delete(formId);
  }, []);

  const updateFormInfo = useCallback((data: FormInfo) => {
    setForms((prevForms) =>
      prevForms.map((form) => (form.formId === data.formId ? data : form))
    );
  }, []);

  const getStore = useCallback((formId: string): ZustandStore | null => {
    return zustandStoreMap.get(formId) || null;
  }, []);

  const createStore = useCallback(
    (formId: string, formLabel: string): ZustandStore => {
      if (!zustandStoreMap.has(formId)) {
        const newStore = createZustandStore({
          formId,
          formLabel,
        });
        zustandStoreMap.set(formId, newStore);
      }
      return zustandStoreMap.get(formId)!;
    },
    []
  );

  return (
    <DesignFormContext.Provider
      value={{
        forms,
        addForm,
        removeFormInfo,
        updateFormInfo,
        getStore,
        createStore,
      }}
    >
      {children}
    </DesignFormContext.Provider>
  );
};

export default DesignFormContextProvider;
