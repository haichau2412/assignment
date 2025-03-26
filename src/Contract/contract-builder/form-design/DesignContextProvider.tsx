import { createContext } from "react";
import createZustandStore from "./store/useZustandStore";
import { useCallback } from "react";

type ZustandStore = ReturnType<typeof createZustandStore>;

const zustandStoreMap = new Map<string, ZustandStore>();

interface FormDesignContext {
  getStore: (id: string) => ZustandStore | null;
  createStore: (id: string) => void;
}

export const DesignFormContext = createContext<FormDesignContext | null>(null);

const DesignFormContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const getStore = useCallback((id: string): ZustandStore | null => {
    return zustandStoreMap.get(id) || null;
  }, []);

  const createStore = useCallback((id: string): ZustandStore => {
    if (!zustandStoreMap.has(id)) {
      const newStore = createZustandStore({
        formId: id,
        formLabel: `Form ${id}`,
      });
      zustandStoreMap.set(id, newStore);
    }
    return zustandStoreMap.get(id)!;
  }, []);

  return (
    <DesignFormContext.Provider value={{ getStore, createStore }}>
      {children}
    </DesignFormContext.Provider>
  );
};

export default DesignFormContextProvider;
