import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import { useFormContext } from "./useFormContext";
import Grid from "@mui/material/Grid2";
import { getText } from "../../i18n/en";

interface TextFieldProps {
  isNumber?: boolean;
  name: string;
  uiSize?: "shrink";
  placeholder?: string;
}

const FormTextField = ({ name, uiSize, isNumber }: TextFieldProps) => {
  const { control, readOnly } = useFormContext();

  return (
    <Grid size={{ xs: uiSize === "shrink" ? 4 : 12 }}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => {
          console.log(field.value);
          return (
            <TextField
              {...field}
              sx={{ width: 1 }}
              disabled={readOnly}
              label={getText(name)}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              onChange={(e) => {
                if (isNumber) {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value)) {
                    field.onChange(value);
                    return;
                  }
                }
                field.onChange(e.target.value);
              }}
              slotProps={{
                input: {
                  readOnly,
                },
              }}
            />
          );
        }}
      />
    </Grid>
  );
};

export default FormTextField;

export const BUILDER_ID = "text-field";

export interface Config {
  type: typeof BUILDER_ID;
  fieldId: string;
  defaultValue?: string;
}
