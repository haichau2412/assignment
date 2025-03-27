import DesignFormContextProvider from "./form-design/DesignContextProvider";
import FormDesign, { LoadFormDesign } from "./form-design/FormDesign";
import { DndContext } from "@dnd-kit/core";
import "./formDesign.css";

export default function App() {
  return (
    <DndContext>
      <DesignFormContextProvider>
        <LoadFormDesign formId="abc" />
        {/* <FormDesign /> */}
      </DesignFormContextProvider>
    </DndContext>
  );
}
