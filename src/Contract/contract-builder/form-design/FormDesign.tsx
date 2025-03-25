import React, { useState } from "react";
import {
  DndContext,
  useDndMonitor,
  useDraggable,
  useDroppable,
  DragEndEvent,
} from "@dnd-kit/core";
import { getText } from "@/libs/i18n/en";
import useDesign from "./useDesign";
import MenuSidebar, { DragOverlayWrapper } from "./FormElementMenu";
import Group from "../form-element/Group";

interface FormItemProps {
  label: string;
}

const FormItem = ({ label }: FormItemProps) => {
  return <div>{getText(label)}</div>;
};

const FormItemContainer = () => {};

const FormBuildContainer = () => {};

const FormDesign = () => {
  const {} = useDesign();

  const dropable = useDroppable({
    id: "form-design-area",
    data: {
      isFormDesign: true,
    },
  });

  useDndMonitor({
    onDragEnd: (event: DragEndEvent) => {
      const { active, over } = event;

      if (!active || !over) {
        return;
      }

      const isMenuItem = active.data.current?.isMenuItem;

      const isDropArea = over.data.current?.isMenuItem;

      if (isMenuItem) {
      }
    },
  });

  return (
    <main className="flex w-full bg-gray-100 min-h-screen h-screen">
      <div
        ref={dropable.setNodeRef}
        className="bg-blue-500 h-full w-full"
      ></div>
      {dropable.isOver && <div>Overrrdsdsdsd</div>}
      <Group id="group" label="group"/>
      <MenuSidebar />
      <DragOverlayWrapper />
    </main>
  );
};

export default FormDesign;
