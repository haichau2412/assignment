import { ReactNode, useEffect } from "react";
import Grid from "@mui/material/Grid2";
import { useForm, UseFormProps } from "react-hook-form";
import { FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { ZodObject, ZodRawShape } from "zod";

type FormProps = {
  children: ReactNode;
  schema: ZodObject<ZodRawShape>;
  title?: string;
  onSubmit?: (data: Record<string, any>) => void;
  mode?: UseFormProps["mode"];
  values?: Record<string, any>;
  defaultValues?: Record<string, any>;
  readOnly?: boolean;
};

const Form = ({
  children,
  schema,
  onSubmit,
  values,
  defaultValues,
  readOnly = false,
}: FormProps) => {
  const form = useForm({
    mode: "all",
    values,
    defaultValues,
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    form.reset(values || defaultValues);
  }, [schema, defaultValues, form.reset, values]);

  const extendedForm = {
    ...form,
    readOnly,
  };

  const _onSubmit = () => {
    const formData = form.getValues();
    const _formData: Record<string, any> = Object.entries(formData).reduce(
      (r, [k, v]) => {
        if (dayjs.isDayjs(v)) {
          r[k] = v.toISOString();
        } else {
          r[k] = v;
        }
        return r;
      },
      {} as Record<string, any>
    );

    if (onSubmit) {
      onSubmit(_formData);
    }
  };

  const _onError = () => {
    console.log("_onError", form.formState.errors);
  };

  return (
    <FormProvider {...extendedForm}>
      <Grid
        container
        spacing={2}
        component="form"
        direction={"column"}
        onSubmit={form.handleSubmit(_onSubmit, _onError)}
        sx={{ overflow: "auto" }}
      >
        {children}
      </Grid>
    </FormProvider>
  );
};

export default Form;
