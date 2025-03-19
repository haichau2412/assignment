import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers";
import { Controller } from "react-hook-form";
import dayjs from "dayjs";
import Grid from "@mui/material/Grid2";
import { getText } from "../../i18n/en";
import { useFormContext } from "./useFormContext";

interface ContractDatePickerProps {
  readOnly?: boolean;
  name: string;
  uiSize?: "shrink";
}

const DatePicker = ({ name, uiSize }: ContractDatePickerProps) => {
  const { control, readOnly } = useFormContext();
  console.log("name", name);
  return (
    <Grid size={{ xs: uiSize === "shrink" ? 4 : 12 }}>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          const dateValue = dayjs.isDayjs(field.value)
            ? field.value
            : dayjs(typeof field.value === "string" ? field.value : new Date());

          return (
            <MuiDatePicker
              sx={{ width: "100%" }}
              label={getText(name)}
              value={dateValue}
              onChange={(newValue) => {
                field.onChange(newValue);
              }}
              slotProps={{
                textField: {
                  error: !!fieldState.error,
                  helperText: fieldState.error?.message,
                },
              }}
              disableOpenPicker={readOnly}
              readOnly={readOnly}
            />
          );
        }}
      />
    </Grid>
  );
};

export default DatePicker;

