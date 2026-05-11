import { ComponentProps, splitProps } from "solid-js";

type SelectProps = ComponentProps<"select"> & {
  name: string;
  label: string;
  error: string;
};

export function Select(props: SelectProps) {
  const [rest, inputProps] = splitProps(props, ["value", "label", "error"]);

  return (
    <label>
      <span>
        {rest.label} {inputProps.required && <span class="text-error">*</span>}
      </span>

      <select
        {...inputProps}
        aria-invalid={!!rest.error}
        aria-errormessage={rest.error}
        value={rest.value ?? ""}
        class="select validator w-full"
      />

      {rest.error && <span class="validator-hint">{props.error}</span>}
    </label>
  );
}
