import { NumberInput } from "@/components/number-input";
import { Select } from "@/components/select";
import { Spinner } from "@/components/spinner";
import { TextInput } from "@/components/text-input";
import { commands, ConfigTomlDto } from "@/lib/bindings";
import { unwrap } from "@/lib/utils";
import {
  createForm,
  maxRange,
  minRange,
  setValues,
  SubmitHandler,
} from "@modular-forms/solid";
import { createAsync } from "@solidjs/router";
import { createEffect, For, Show } from "solid-js";
import { toast } from "solid-sonner";
import { COLOR_SCHEMAS, RESIZE_FILTERS } from "./config.data";
import { getConfig } from "./config.service";
import { TemplateDeleteModal } from "./template-delete-modal";
import { TemplateEditModal } from "./template-edit-modal";
import { TemplateModal } from "./template-modal";

export function ConfigForm() {
  const configToml = createAsync(() => getConfig());
  const [configForm, { Form, Field, FieldArray }] = createForm<ConfigTomlDto>({
    initialValues: configToml(),
  });

  createEffect(() => {
    const config = configToml();
    if (!config) return;
    setValues(configForm, config);
  });

  const handleSubmit: SubmitHandler<ConfigTomlDto> = async (values) => {
    try {
      await unwrap(commands.saveNewConfig(values));
      toast.success("The config have been saved");
    } catch (error) {
      console.log(error);
      toast.error("Failed to save the config");
    }
  };

  return (
    <Form onSubmit={handleSubmit} class="flex flex-col gap-2">
      <fieldset class="fieldset">
        <Field name="app.color_schema">
          {(field, props) => (
            <Select
              {...props}
              label="Color schema"
              name={field.name}
              value={field.value}
              error={field.error}
              required
            >
              <For each={COLOR_SCHEMAS}>
                {(items) => <option value={items.value}>{items.label}</option>}
              </For>
            </Select>
          )}
        </Field>

        <Field
          name="app.contrast"
          type="number"
          validate={[minRange(-1, "Minimum -1"), maxRange(1, "Maximum 1")]}
        >
          {(field, props) => (
            <NumberInput
              {...props}
              label="Contrast"
              name={field.name}
              value={field.value}
              error={field.error}
              required
              step={0.1}
              max={1}
              min={-1}
            />
          )}
        </Field>

        <Field name="app.mode">
          {(field, props) => (
            <Select
              {...props}
              label="Mode"
              name={field.name}
              value={field.value}
              error={field.error}
              required
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </Select>
          )}
        </Field>

        <Field name="app.resize_filter">
          {(field, props) => (
            <Select
              {...props}
              label="Resize filter"
              name={field.name}
              value={field.value}
              error={field.error}
              required
            >
              <For each={RESIZE_FILTERS}>
                {(items) => <option value={items.value}>{items.label}</option>}
              </For>
            </Select>
          )}
        </Field>

        <Field name="app.fallback_color">
          {(field, props) => (
            <TextInput
              {...props}
              label="Fallback color"
              name={field.name}
              value={field.value}
              error={field.error}
              type="color"
              required
            />
          )}
        </Field>
      </fieldset>

      <fieldset class="fieldset">
        <legend class="fieldset-legend">Templates</legend>

        <ul class="list bg-base-200 rounded-box">
          <FieldArray name="templates">
            {(fieldArray) => (
              <For each={fieldArray.items}>
                {(_, index) => (
                  <>
                    <li class="list-row items-center">
                      <Field name={`templates.${index()}.key`}>
                        {(field) => (
                          <div class="list-col-grow">{field.value}</div>
                        )}
                      </Field>

                      <TemplateEditModal form={configForm} index={index()} />
                      <TemplateDeleteModal form={configForm} index={index()} />
                    </li>
                  </>
                )}
              </For>
            )}
          </FieldArray>
        </ul>
      </fieldset>

      <div class="flex gap-2">
        <button class="btn btn-primary w-fit" disabled={configForm.submitting}>
          <Show when={!configForm.submitting} fallback={<Spinner />}>
            Save
          </Show>
        </button>

        <TemplateModal form={configForm} />
      </div>
    </Form>
  );
}
