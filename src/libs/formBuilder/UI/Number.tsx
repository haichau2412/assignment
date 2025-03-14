export const BUILDER_ID = "number";

export interface Config {
  type: typeof BUILDER_ID;
  fieldId: string;
  defaultValue?: number;
}
