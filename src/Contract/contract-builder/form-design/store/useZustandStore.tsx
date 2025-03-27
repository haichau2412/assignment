import { createStore } from "../createStore";

interface NormalItem {
  id: string;
  label: string;
  groupId?: string;
  data: any;
}

interface GroupItem {
  id: string;
  label: string;
  type: "group";
  groupId: string;
}

type FormItem = NormalItem | GroupItem;

interface FormDesignSchema {
  formId: string;
  formLabel: string;
  data: FormItem[];
}

type Actions = {
  addItem: (item: FormItem) => void;
  removeItem: (id: string) => void;
  updateFormItemData: (item: FormItem) => void;
  updateItemLocation: (fromIndex: number, toIndex: number) => void;
};

type Store = FormDesignSchema & Actions;

export type StoreType = ReturnType<typeof createStore<Store>>;

const createZustandStore = ({
  formId,
  formLabel,
}: Omit<FormDesignSchema, "data">) => {
  return createStore<Store>(
    (set) => ({
      formId: formId,
      formLabel: formLabel,
      data: [],
      addItem: (item) => {
        set((state) => {
          state.data.push(item);
        });
      },
      removeItem: (id) => {
        set((state: FormDesignSchema) => {
          state.data = state.data.filter((d) => d.id !== id);
        });
      },
      updateFormItemData: (item) => {
        set((state: FormDesignSchema) => {});
      },
      updateItemLocation: () => {
        set((state: FormDesignSchema) => {});
      },
    }),
    {
      name: formId,
    }
  );
};

export default createZustandStore;
