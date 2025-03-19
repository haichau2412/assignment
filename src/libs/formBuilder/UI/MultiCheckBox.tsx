import { FormControlLabel, Checkbox, FormGroup, Grid2 } from "@mui/material";
import { useFormContext } from "./useFormContext";
import { getText } from "../../i18n/en";

interface MultiCheckboxProps {
  name: string;
  readOnly?: boolean;
  unCheckable?: boolean;
  options: { id: string; option?: Record<string, any> }[];
}

export default function MultiCheckbox({
  options,
  name,
  unCheckable,
}: MultiCheckboxProps) {
  const { register, readOnly, watch } = useFormContext();

  let selected: string[] = watch(name, []) as unknown as string[];

  if (!Array.isArray(selected)) {
    selected = [];
  }

  return (
    <Grid2 size={{ xs: 12 }}>
      <FormGroup>
        {options.map((option) => {
          return (
            <FormControlLabel
              key={option.id}
              control={
                <>
                  <Checkbox
                    {...register(name)}
                    value={option.id}
                    checked={!!selected.find((data) => data === option.id)}
                    disabled={unCheckable || readOnly}
                  />
                </>
              }
              label={
                <>
                  <p>{getText(option.id)}</p>
                  {typeof option?.option?.fee === "number" && (
                    <p>
                      {`${getText(
                        "insurance_amount"
                      )}: $${option.option.fee.toFixed(2)}`}
                    </p>
                  )}
                </>
              }
            />
          );
        })}
      </FormGroup>
    </Grid2>
  );
}
