import { useDroppable } from "@dnd-kit/core";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

interface GroupProps {
  id: string;
  label: string;
  children: React.ReactNode;
  isGroupClutch?: boolean;
  side?: string;
}

const FormElementWrapper = ({
  id,
  children,
  isGroupClutch,
  side,
}: GroupProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: id,
    },
  });

  const css = clsx(
    "w-full h-[100px] p-[20px] bg-amber-600  rounded-sm border-2 border-transparent",
    {
      "border-t-gray-800 bg-amber-200": isOver && side === "top",
      "border-b-gray-800 bg-amber-200": isOver && side === "bottom",
      "border-dashed border-blue-300 bg-amber-200": isGroupClutch,
    }
  );

  return (
    <div ref={setNodeRef} className={twMerge(css)}>
      {children}
    </div>
  );
};

export default FormElementWrapper;
