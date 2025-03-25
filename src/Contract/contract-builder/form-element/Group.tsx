import { useDroppable } from "@dnd-kit/core";

const GroupItemWrapper = ({ groupId }: { groupId: string }) => {



    
};

interface GroupProps {
  id: string;
  label: string;
}

const Group = ({ id, label = "" }: GroupProps) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  console.log("label", label);

  const style = {
    border: "2px dashed gray",
    padding: "20px",
    backgroundColor: isOver ? "lightgreen" : "white",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-[100px] h-[100px] bg-amber-600"
    >
      <p>Drop Area {id}</p>
    </div>
  );
};

export default Group;
