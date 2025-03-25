export const ElementBuilderId = {
  multiCheckbox: "multi-checkbox",
  textfield: "text-field",
  number: "number",
  select: "select",
  datePicker: "date-picker",
} as const;

interface CommonData {
  fieldId: string;
  label: string;
  key: string;
  defaultValue?: any;
  placeholder?: string;
}

interface SelectValidate {
  required: boolean;
}

interface MultiCheckBoxValidate {
  required: boolean;
}

interface StringValidate {
  required: boolean;
  minLength: number;
  maxLength: number;
  pattern?: string;
}

interface NumberValidate {
  required: boolean;
  minLength: number;
  maxLength: number;
  pattern?: string;
}

export interface SelectConfig extends CommonData {
  type: typeof ElementBuilderId.select;
  options: { content: string; id: string }[];
  validation?: SelectValidate;
}

interface DatePickerValidate {
  required: boolean;
  from: string;
  to: string;
  duration?: {
    year?: number;
    month?: number;
    day?: number;
  };
}

export interface DatePickerConfig extends CommonData {
  type: typeof ElementBuilderId.datePicker;
  validate?: DatePickerValidate;
}

export interface NumberConfig extends CommonData {
  type: typeof ElementBuilderId.number;
  validate?: NumberValidate;
}

export interface TextfieldConfig extends CommonData {
  type: typeof ElementBuilderId.textfield;
  validation: StringValidate;
}

export interface MultiCheckboxConfig extends CommonData {
  type: typeof ElementBuilderId.multiCheckbox;
  options: { id: string; option?: Record<string, any> }[];
  validation: MultiCheckBoxValidate
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
