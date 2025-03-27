import React, { useEffect, useRef, useState } from "react";
import {
  DndContext,
  useDndMonitor,
  useDraggable,
  useDroppable,
  DragEndEvent,
  DragMoveEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { getText } from "@/libs/i18n/en";
import useDesign from "./useDesign";
import MenuSidebar, { DragOverlayWrapper } from "./FormElementMenu";
import Group from "../form-element/Group";
import FormElementWrapper from "../form-element/FormElementWrapper";
import { MenuItemData } from "./FormElementMenu";
import { StoreType } from "./store/useZustandStore";
interface FormItemProps {
  label: string;
}

const FormItem = ({ label }: FormItemProps) => {
  return <div>{getText(label)}</div>;
};

const FormItemContainer = () => {};

export const LoadFormDesign = ({ formId }: { formId: string }) => {
  const { addForm, forms, getStore, createStore } = useDesign();
  const formInfo = forms.find((f) => f.formId === formId);
  const store = getStore(formId);

  useEffect(() => {}, [createStore, store]);

  if (store && formInfo) {
    return <FormDesign store={store} />;
  }

  if (!store) {
    createStore(formId, "dummy");
  }

  if (!formInfo) {
    addForm({
      formId,
      formLabel: "dummy",
    });
  }

  return <div>Loading</div>;
};

let simpleIndex = 0;

const FormDesign = ({ store }: { store: StoreType }) => {
  const { formLabel, data, addItem } = store();
  const [dropLocation, setDropLocation] = useState<string | null>(null);
  const [draggedType, setDraggedType] = useState<string | null>(null);
  const [clutched, setClutched] = useState<boolean>(false);
  const finalLocation = useRef<string | null>(null);
  const clutchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    finalLocation.current = dropLocation;
  }, [dropLocation]);

  const dropable = useDroppable({
    id: "form-design-area",
    data: {
      area: "form-design-area",
    },
  });

  useEffect(() => {
    if (dragging || !draggedType || !dropLocation) {
      return;
    }

    setDraggedType(null);
    setDropLocation(null);
  }, [dragging, draggedType, dropLocation]);

  useDndMonitor({
    onDragStart: (event: DragStartEvent) => {
      const { active } = event;
      const data = active.data.current as MenuItemData;
      if (data.isMenuItem) {
        setDraggedType(data.type);
        setDragging(true);
      }
    },
    onDragCancel: () => {
      setDraggedType(null);
      setDropLocation(null);
      setDragging(false);
      setClutched(false);
    },
    onDragEnd: (event: DragEndEvent) => {
      const { active, over } = event;

      if (!active || !over || !draggedType) {
        return;
      }

      addItem({
        id: `${simpleIndex}-${draggedType}`,
        label: draggedType,
        type: "group",
        data: {},
      });
      setDragging(false);
      setClutched(false);
    },
    onDragMove: (event: DragMoveEvent) => {
      const { active, over } = event;

      const data = over?.data?.current as MenuItemData;

      if (over && active.rect.current.translated && data?.type === "group") {
        if (clutchTimeout.current) {
          if (clutched) {
            setClutched(false);
          }
          clearTimeout(clutchTimeout.current);
        }
        clutchTimeout.current = setTimeout(() => {
          setClutched(true);
        }, 500);

        const { height: tHeight, bottom: tBottom } =
          active.rect.current.translated;
        const { height: dropHeight, bottom: dropBottom } = over.rect;

        const tYCenter = (tBottom - tHeight) / 2;
        const dropCenter = (dropBottom - dropHeight) / 2;
        const location = dropCenter - tYCenter > 0 ? "top" : "bottom";

        const locationData = finalLocation.current?.split("-");

        const id = locationData?.[0];
        const side = locationData?.[1];

        if (id !== over.id || side !== location) {
          setDropLocation(`${over.id}-${location}`);
        }
        return;
      }
    },
  });

  const locationData = dropLocation?.split("-");
  const id = locationData?.[0];
  const side = locationData?.[1];

  return (
    <>
      <div>
        <input type="text" value={formLabel} />
      </div>
      <main className="flex w-full bg-gray-100 min-h-screen h-screen">
        <div ref={dropable.setNodeRef} className="bg-blue-500 h-full w-full">
          {data.map((d) => {
            return (
              <FormElementWrapper
                key={d.id}
                id="group"
                isGroupClutch={id === "group" && clutched}
                side={side}
              >
                <Group id="group" label="group" />
              </FormElementWrapper>
            );
          })}
          {/* <FormElementWrapper
            id="group"
            isGroupClutch={id === "group" && clutched}
            side={side}
          >
            <Group id="group" label="group" />
          </FormElementWrapper>
          <FormElementWrapper id="group2" side={side}>
            <Group id="group2" label="group2" />
          </FormElementWrapper> */}
        </div>
        <MenuSidebar />
        <DragOverlayWrapper />
      </main>
    </>
  );
};

export default FormDesign;
