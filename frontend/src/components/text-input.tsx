import { ComponentProps, splitProps } from "solid-js";

type InputProps = ComponentProps<"input"> & {
  name: string;
  label: string;
};

export function TextInput(props: InputProps) {
  const [rest, inputProps] = splitProps(props, ["value", "label"]);

  return (
    <label>
      <span>
        {rest.label} {inputProps.required && <span class="text-error">*</span>}
      </span>

      <input
        {...inputProps}
        value={rest.value ?? ""}
        class="input validator w-full"
      />
    </label>
  );
}
