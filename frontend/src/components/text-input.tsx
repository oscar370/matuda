import { ComponentProps, splitProps } from "solid-js";

type InputProps = ComponentProps<"input"> & {
  name: string;
  label: string;
  error: string;
};

export function TextInput(props: InputProps) {
  const [rest, inputProps] = splitProps(props, ["value", "label", "error"]);

  return (
    <label>
      <span>
        {rest.label} {inputProps.required && <span class="text-error">*</span>}
      </span>

      <input
        {...inputProps}
        aria-invalid={!!rest.error}
        aria-errormessage={rest.error}
        value={rest.value ?? ""}
        class="input validator w-full"
      />

      {rest.error && <span class="validator-hint">{props.error}</span>}
    </label>
  );
}
