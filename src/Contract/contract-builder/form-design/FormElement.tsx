
import React from "react";
import { useDraggable } from "@dnd-kit/core"


interface FormElementProps {
  id: string;
  label: string;
}

const FormElement = ({id, label}: FormElementProps) => {

    const draggable = useDraggable({
        id: `element-${id}`
    })


    return <button>


    </button>

};

export default FormElement;
