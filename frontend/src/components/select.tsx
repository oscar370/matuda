import { ComponentProps, splitProps } from "solid-js";

type SelectProps = ComponentProps<"select"> & {
  name: string;
  label: string;
};

export function Select(props: SelectProps) {
  const [rest, inputProps] = splitProps(props, ["value", "label"]);

  return (
    <label>
      <span>
        {rest.label} {inputProps.required && <span class="text-error">*</span>}
      </span>

      <select
        {...inputProps}
        value={rest.value ?? ""}
        class="select validator w-full"
      />
    </label>
  );
}
