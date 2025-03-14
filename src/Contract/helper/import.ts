import { z } from "zod";

const OptionSchema = z.object({
  content: z.string().optional(),
  id: z.string(),
});

const FieldSchema = z.object({
  fieldId: z.string(),
  type: z.string(),
  uiSize: z.string().optional(),
  defaultValue: z.any().optional(),
  options: z.array(OptionSchema).optional(),
  placeholder: z.string().optional(),
});

const GroupSchema = z.object({
  group_id: z.string(),
  schema: z.array(FieldSchema),
});

const StepSchema = z.object({
  step_id: z.string(),
  config: z.array(GroupSchema),
});

const FeeCalculationSchema = z.object({
  date_of_birth: z.object({
    type: z.literal("date-picker"),
    to: z.string(),
    duration: z.object({ years: z.number() }),
  }),
});

const InsuredObjectSchema = z.object({
  object_id: z.string(),
  steps: z.array(StepSchema),
  feeCalucation: FeeCalculationSchema,
});

const PolicySchema = z.object({
  policyName: z.string(),
  productId: z.string(),
  insuredObject: z.array(InsuredObjectSchema),
  steps: z.array(StepSchema),
});

export default PolicySchema;