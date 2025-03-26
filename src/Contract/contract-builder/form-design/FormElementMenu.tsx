import React from "react";
import {
  useDndMonitor,
  useDraggable,
  Active,
  DragOverlay,
} from "@dnd-kit/core";
import { ElementBuilderId } from "@/contract/schema/schema-builder/types";
import { getText } from "@/libs/i18n/en";
import clsx from "clsx";

interface FormElementProps {
  id: string;
  label: string;
  isOverlay?: boolean;
}

export interface MenuItemData {
  type: string;
  isMenuItem: true;
  id: string;
  label: string;
}

const MenuItem = ({ id, label, isOverlay }: FormElementProps) => {
  const draggable = useDraggable({
    id: `${id}`,
    data: {
      type: id,
      isMenuItem: true,
    },
  });

  return (
    <button
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      className={clsx(
        "h-[100px] w-[100px] bg-red-100",
        isOverlay ? "cursor-grabbing" : "cursor-grab"
      )}
    >
      {getText(label)}
    </button>
  );
};

const SUPPORTED_ELEMENTS: FormElementProps[] = [];

SUPPORTED_ELEMENTS.push(
  {
    label: "group",
    id: "group",
  },
  ...Object.values(ElementBuilderId).map((d) => ({
    id: d,
    label: d,
  }))
);

export const DragOverlayWrapper = () => {
  const [draggedItem, setDraggedItem] = React.useState<Active | null>(null);

  useDndMonitor({
    onDragStart: (event) => {
      setDraggedItem(event.active);
    },
    onDragCancel: () => {
      setDraggedItem(null);
    },
    onDragEnd: () => {
      setDraggedItem(null);
    },
  });

  if (!draggedItem) {
    return null;
  }

  let node = draggedItem.data.current?.isMenuItem ? (
    <MenuItem
      isOverlay={true}
      id={draggedItem.data.current?.id}
      label={draggedItem.data.current?.label}
    />
  ) : (
    <div>No drag overlay</div>
  );

  return <DragOverlay>{node}</DragOverlay>;
};

const MenuSidebar = () => {
  return (
    <aside className="formElementMenu">
      {SUPPORTED_ELEMENTS.map((d) => {
        return <MenuItem key={d.id} {...d} />;
      })}
    </aside>
  );
};

export default MenuSidebar;
