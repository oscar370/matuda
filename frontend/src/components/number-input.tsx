import { ComponentProps, createMemo, splitProps } from "solid-js";

type NumberInputProps = ComponentProps<"input"> & {
  name: string;
  label: string;
  error: string;
  value?: number;
};

export function NumberInput(props: NumberInputProps) {
  const [rest, inputProps] = splitProps(props, ["value", "label", "error"]);

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
        aria-invalid={!!rest.error}
        aria-errormessage={rest.error}
        value={getValue()}
        class="input validator w-full"
        type="number"
      />

      {rest.error && <span class="validator-hint">{props.error}</span>}
    </label>
  );
}
