import { useState } from "react";

interface GroupProps {
  id: string;
  label: string;
  includedInSchema: boolean;
}

const Group = ({ id, label = "", includedInSchema }: GroupProps) => {
  const [groupId, setgroupId] = useState<string| null>(null)

  return <input type="text" value={id} id={id} />;
};

export default Group;
