import {
  Config as SelectConfig,
  BUILDER_ID as SelectBuilderId,
} from "./Select";

import {
  Config as DatePickerConfig,
  BUILDER_ID as DatePickerBuilderId,
} from "./DatePicker";

import {
  Config as NumberConfig,
  BUILDER_ID as NumberBuilderId,
} from "./Number";

import {
  Config as TextfieldConfig,
  BUILDER_ID as TextfieldBuilderId,
} from "./TextField";

import {
  Config as MultiCheckboxConfig,
  BUILDER_ID as MultiCheckboxBuilderId,
} from "./MultiCheckBox";
import dayjs from "dayjs";

import { z, ZodObject, ZodRawShape } from "zod";

interface TextFree {
  type: typeof TextfieldBuilderId;
  match: string;
}

interface NumberFree {
  type: typeof NumberBuilderId;
  match?: number;
  range?: [number, number];
}

interface Date {
  type: typeof DatePickerBuilderId;
  to?: { years?: number; months?: number } | "now";
  form?: { years?: number; months?: number };
  duration: { years?: number; months?: number };
}

export interface MandatoryFeeRule {
  [fieldId: string]: TextFree | NumberFree | Date;
}

export {
  SelectBuilderId,
  DatePickerBuilderId,
  NumberBuilderId,
  TextfieldBuilderId,
  MultiCheckboxBuilderId,
};

export type SchemaData = (
  | SelectConfig
  | DatePickerConfig
  | NumberConfig
  | TextfieldConfig
  | MultiCheckboxConfig
) & {
  uiSize?: "shrink";
};

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
      if (
        ![
          DatePickerBuilderId,
          TextfieldBuilderId,
          SelectBuilderId,
          NumberBuilderId,
          MultiCheckboxBuilderId,
        ].includes(d.type)
      ) {
        throw new Error(`Unknown builder type: ${d.type}`);
      }

      if (d.type === DatePickerBuilderId) {
        addSchema(_createDatePicker(d));
        // defaultValue[d.fieldId] = new Date();
        // return;
      }
      if (d.type === TextfieldBuilderId) {
        addSchema(_createTextField(d));
      }
      if (d.type === SelectBuilderId) {
        addSchema(_createSelect(d));
      }
      // if (d.type === SliderBuilderId) {
      //   addSchema(_createSlider(d));
      // }

      if (d.type === NumberBuilderId) {
        addSchema(_createNumber(d));
      }
      if (d.type === MultiCheckboxBuilderId) {
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
