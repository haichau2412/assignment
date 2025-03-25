import dayjs from "dayjs";
import { z, ZodObject, ZodRawShape } from "zod";
import { SchemaData } from "../schema-builder/types";
import {
  SelectConfig,
  DatePickerConfig,
  NumberConfig,
  MultiCheckboxConfig,
  TextfieldConfig,
  ElementBuilderId
} from "../schema-builder/types";

export type GroupSchema = {
  group_id: string;
  schema: SchemaData[];
};

const _createSelect = ({ options, fieldId }: SelectConfig) => {
  const _options = options.map(({ id }) => id) as unknown as readonly [
    string,
    ...string[]
  ];

  return z.object({
    [fieldId]: z.enum(_options),
  });
};

const _createDatePicker = ({ fieldId }: DatePickerConfig) => {
  return z.object({
    [fieldId]: z.custom((val) => dayjs(val).isValid(), "Please change to new"),
  });
};

const _createNumber = ({ fieldId }: NumberConfig) => {
  return z.object({
    [fieldId]: z.number({
      required_error: "Required",
    }),
  });
};

const _createMultiCheckBox = ({ fieldId }: MultiCheckboxConfig) => {
  return z.object({
    [fieldId]: z.array(z.string()).optional(),
  });
};

const _createTextField = ({ fieldId }: TextfieldConfig) => {
  return z.object({
    [fieldId]: z.string().min(1, "Required"),
  });
};

const createZodSchema = (groupSchema: GroupSchema[]) => {
  let zodSchema = z.object({});

  const addSchema = (newZod?: ZodObject<ZodRawShape>) => {
    if (newZod) {
      zodSchema = zodSchema.extend(newZod.shape);
    }
  };

  const defaultValue: any = {};

  groupSchema.forEach(({ schema }) => {
    schema.forEach((d) => {
      if (!Object.values(ElementBuilderId).includes(d.type)) {
        throw new Error(`Unknown builder type: ${d.type}`);
      }

      if (d.type === ElementBuilderId.datePicker) {
        addSchema(_createDatePicker(d));
      }
      if (d.type === ElementBuilderId.textfield) {
        addSchema(_createTextField(d));
      }
      if (d.type === ElementBuilderId.select) {
        addSchema(_createSelect(d));
      }

      if (d.type === ElementBuilderId.number) {
        addSchema(_createNumber(d));
      }
      if (d.type === ElementBuilderId.multiCheckbox) {
        addSchema(_createMultiCheckBox(d));
        defaultValue[d.fieldId] = d.defaultValue || [];
        return;
      }

      defaultValue[d.fieldId] = d.defaultValue || null;
    });
  });

  return {
    zodSchema,
    defaultValue,
  };
};

export default createZodSchema;
