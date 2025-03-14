import {
  Autocomplete,
  AutocompleteProps,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { Controller, FieldValues, Path } from "react-hook-form";
import { forwardRef, ReactElement, Ref } from "react";
import { useFormContext } from "react-hook-form";

type _AutocompleteProps<T extends FieldValues, Multiple extends boolean | undefined> = Omit<
  AutocompleteProps<any, Multiple, any, any>,
  "name" | "value" | "onChange" | "renderInput"
> & {
  name: Path<T>;
  options: readonly any[];
  getOptionLabel: (option: any) => string;
  renderInput?: (params: any) => ReactElement<TextFieldProps>;
};

const FormAutocomplete = forwardRef(
  <T extends FieldValues, Multiple extends boolean | undefined>(
    {
      name,
      options,
      getOptionLabel,
      renderInput = (params) => <TextField {...params} />,
      ...autocompleteProps
    }: _AutocompleteProps<T, Multiple>,
    ref: Ref<HTMLDivElement>
  ) => {
    const { control, readOnly } = useFormContext<T>();

    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Autocomplete
            {...autocompleteProps}
            {...field}
            ref={ref}
            options={options}
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={(option, value) => option === value}
            disabled={readOnly}
            renderInput={(params) =>
              renderInput({
                ...params,
                error: !!error,
                helperText: error?.message,
              })
            }
          />
        )}
      />
    );
  }
) as <T extends FieldValues, Multiple extends boolean | undefined>(
  props: _AutocompleteProps<T, Multiple> & { ref?: Ref<HTMLDivElement> }
) => ReactElement;

export default FormAutocomplete;


export const SUPPORTED_FIELD_TYPE = 'autocomplete'