import { ComponentProps, createMemo, splitProps } from "solid-js";

type NumberInputProps = ComponentProps<"input"> & {
  name: string;
  label: string;
  value?: number;
};

export function NumberInput(props: NumberInputProps) {
  const [rest, inputProps] = splitProps(props, ["value", "label"]);

  const getValue = createMemo<number | undefined>((prevValue) =>
    !Number.isNaN(rest.value) ? rest.value : prevValue,
  );

  return (
    <label>
      <span>
        {rest.label} {inputProps.required && <span class="text-error">*</span>}
      </span>

      <input
        {...inputProps}
        value={getValue()}
        class="input validator w-full"
        type="number"
      />
    </label>
  );
}
