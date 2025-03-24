import { useFormContext as useRHFFormContext, UseFormReturn } from "react-hook-form";

type FormContext<T extends Record<string, unknown>> = UseFormReturn<T> & {
    readOnly: boolean;
};


const useFormContext = <T extends Record<string, unknown>>() => {
    const context = useRHFFormContext<T>() as FormContext<T>;

    if (context === undefined) {
        throw new Error("useFormContext must be used within a FormProvider");
    }

    return context;
};

export { useFormContext };
