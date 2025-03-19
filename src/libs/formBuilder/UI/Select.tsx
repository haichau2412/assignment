import {
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  FormHelperText,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import { useFormContext } from "./useFormContext";
import { Controller } from "react-hook-form";
import { getText } from "../../i18n/en";

interface ContractSelectProps {
  id: string;
  readOnly?: boolean;
  label: string;
  uiSize?: "shrink";
  placeholder?: string;
  options: {
    id: string;
    content: string;
  }[];
}

const ContractSelect = ({
  options,
  id,
  placeholder,
  uiSize,
  label,
}: ContractSelectProps) => {
  const { control, readOnly } = useFormContext();
  console.log("label", label);

  return (
    <Grid size={{ xs: uiSize === "shrink" ? 4 : 12 }}>
      <Controller
        control={control}
        name={id}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <FormControl fullWidth error={!!error}>
            <InputLabel shrink={true} id={`${id}_label`}>
              {getText(label)}
            </InputLabel>
            <Select
              disabled={readOnly ?? false}
              displayEmpty
              labelId={`${id}_label`}
              id={id}
              value={value || ""}
              label={getText(label)}
              onChange={onChange}
            >
              {placeholder && (
                <MenuItem value="" disabled>
                  {placeholder}
                </MenuItem>
              )}

              {options.map(({ id, content }) => {
                return (
                  <MenuItem key={id} value={id}>
                    {content}
                  </MenuItem>
                );
              })}
            </Select>
            {error && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
    </Grid>
  );
};

export default ContractSelect;