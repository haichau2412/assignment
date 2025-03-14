import DataPicker from "./DatePicker";
import Select from "./Select";
import FormTextField from "./TextField";
import MultiCheckbox from "./MultiCheckBox";

import createZodSchema, {
  GroupSchema,
  SelectBuilderId,
  DatePickerBuilderId,
  NumberBuilderId,
  TextfieldBuilderId,
  MultiCheckboxBuilderId,
} from "./schemaBuilder";
import Form from "./Form";
import { Button, Grid2, Typography } from "@mui/material";
import { getText } from "../../i18n/en";

interface FormChildrenGeneratorProps {
  schema: GroupSchema[];
  onSubmit?: (data: Record<string, any>) => void;
  value?: Record<string, any>;
  readOnly?: boolean;
}

const CreateChildrenComponent = ({
  schema,
}: Omit<FormChildrenGeneratorProps, "onSubmit">) => {
  return schema.map(({ group_id, schema }) => {
    return (
      <>
        <Grid2 key={group_id} container spacing={2}>
          <Grid2 size={12}>
            <Typography variant="h6" sx={{ mb: 2, color: "black" }}>
              {getText(group_id)}
            </Typography>
          </Grid2>

          {schema.map((data) => {
            if (data.type === SelectBuilderId) {
              return (
                <Select
                  uiSize={data.uiSize}
                  key={data.fieldId}
                  id={data.fieldId}
                  label={data.fieldId}
                  options={data.options}
                  placeholder={data.placeholder}
                />
              );
            }
            if (data.type === DatePickerBuilderId) {
              return (
                <DataPicker
                  uiSize={data.uiSize}
                  key={data.fieldId}
                  name={data.fieldId}
                />
              );
            }
            // if (data.type === SliderBuilderId) {
            //   return <Slider uiSize={data.uiSize} key={data.fieldId} />;
            // }
            if (data.type === NumberBuilderId) {
              return (
                <FormTextField
                  isNumber={true}
                  uiSize={data.uiSize}
                  key={data.fieldId}
                  name={data.fieldId}
                />
              );
            }
            if (data.type === TextfieldBuilderId) {
              return (
                <FormTextField
                  uiSize={data.uiSize}
                  key={data.fieldId}
                  name={data.fieldId}
                />
              );
            }
            if (data.type === MultiCheckboxBuilderId) {
              return (
                <MultiCheckbox
                  unCheckable={data.unCheckable}
                  key={data.fieldId}
                  name={data.fieldId}
                  options={data.options}
                />
              );
            }
          })}
        </Grid2>
      </>
    );
  });
};

const FormChildrenGenerator = ({
  schema,
  onSubmit,
  value,
  readOnly,
}: FormChildrenGeneratorProps) => {
  const { zodSchema, defaultValue } = createZodSchema(schema);

  return (
    <Form
      schema={zodSchema}
      defaultValues={defaultValue}
      values={value}
      onSubmit={onSubmit}
      readOnly={readOnly}
    >
      <CreateChildrenComponent schema={schema} />
      {!readOnly && (
        <Grid2 sx={{ alignSelf: "flex-end", my: "10px" }}>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Grid2>
      )}
    </Form>
  );
};

export default FormChildrenGenerator;
