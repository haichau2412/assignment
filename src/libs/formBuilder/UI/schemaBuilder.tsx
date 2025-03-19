import dayjs from "dayjs";
import { z, ZodObject, ZodRawShape } from "zod";

export const ElementBuilderId = {
  multiCheckbox: "multi-checkbox",
  textfield: "text-field",
  number: "number",
  select: "select",
  datePicker: "date-picker",
} as const;

export interface SelectConfig {
  type: typeof ElementBuilderId.select;
  options: { content: string; id: string }[];
  fieldId: string;
  defaultValue?: string;
  placeholder?: string;
}

export interface DatePickerConfig {
  type: typeof ElementBuilderId.datePicker;
  fieldId: string;
  defaultValue?: string;
}

export interface NumberConfig {
  type: typeof ElementBuilderId.number;
  fieldId: string;
  defaultValue?: number;
}

export interface TextfieldConfig {
  type: typeof ElementBuilderId.textfield;
  fieldId: string;
  defaultValue?: string;
}

export interface MultiCheckboxConfig {
  type: typeof ElementBuilderId.multiCheckbox;
  options: { id: string; option?: Record<string, any> }[];
  fieldId: string;
  unCheckable?: boolean;
  defaultValue?: string[];
}

interface TextFree {
  type: typeof ElementBuilderId.textfield;
  match: string;
}

interface NumberFree {
  type: typeof ElementBuilderId.number;
  match?: number;
  range?: [number, number];
}

interface Date {
  type: typeof ElementBuilderId.datePicker;
  to?: { years?: number; months?: number } | "now";
  form?: { years?: number; months?: number };
  duration: { years?: number; months?: number };
}

export interface MandatoryFeeRule {
  [fieldId: string]: TextFree | NumberFree | Date;
}

interface ElementLayoutConfig {
  uiSize?: "shrink";
}

export type SchemaData = (
  | SelectConfig
  | DatePickerConfig
  | NumberConfig
  | TextfieldConfig
  | MultiCheckboxConfig
) &
  ElementLayoutConfig;

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
        // defaultValue[d.fieldId] = new Date();
        // return;
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
