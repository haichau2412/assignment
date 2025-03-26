import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { TextfieldConfig } from "@/contract/schema/schema-builder/types";
import { useEffect } from "react";

type Schema = TextfieldConfig;

const schema = z.object({
  fieldId: z.string().min(2).max(20),
  label: z.string().min(2).max(50),
  defaultValue: z.string().nullable(),
  placeholder: z.string().max(50),
  required: z.boolean().default(false),
});

type schemaType = z.infer<typeof schema>;

interface TextFieldFrom {
  defaultValues: Partial<schemaType>;
}

const TextFieldComponent = ({ defaultValues }: TextFieldFrom) => {
  const form = useForm<schemaType>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [form, defaultValues]);

  const saveChangee = () => {
    // call update form data
  };

  return <div>Text field form</div>;
};

export const TextFieldForm = () => {};
