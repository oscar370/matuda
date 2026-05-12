import { NumberInput } from "@/components/number-input";
import { Select } from "@/components/select";
import { Spinner } from "@/components/spinner";
import { TextInput } from "@/components/text-input";
import { commands, ConfigTomlDto } from "@/lib/bindings";
import { unwrap as unwrapResult } from "@/lib/utils";
import { createAsync } from "@solidjs/router";
import { createEffect, createSignal, For, Show } from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import { toast } from "solid-sonner";
import {
  COLOR_SCHEMAS,
  GOOD_PREFER_COLORS,
  RESIZE_FILTERS,
} from "./config.data";
import { getConfig } from "./config.service";
import { TemplateDeleteModal } from "./template-delete-modal";
import { TemplateEditModal } from "./template-edit-modal";
import { TemplateModal } from "./template-modal";

export function ConfigForm() {
  const configToml = createAsync(() => getConfig());

  const [store, setStore] = createStore<ConfigTomlDto>({
    app: {
      color_schema: "",
      contrast: 0,
      mode: "dark",
      resize_filter: "",
      fallback_color: "",
      prefer: "",
    },
    templates: [],
  });

  const [isSubmitting, setIsSubmitting] = createSignal(false);

  createEffect(() => {
    const config = configToml();
    if (!config) return;
    setStore(config);
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await unwrapResult(commands.saveNewConfig(unwrap(store)));
      toast.success("The config have been saved");
    } catch (error) {
      console.log(error);
      toast.error("Failed to save the config");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} class="flex flex-col gap-2">
      <fieldset class="fieldset">
        <Select
          label="Color schema"
          name="app.color_schema"
          value={store.app.color_schema}
          onInput={(e) =>
            setStore("app", "color_schema", e.currentTarget.value)
          }
          required
        >
          <For each={COLOR_SCHEMAS}>
            {(items) => <option value={items.value}>{items.label}</option>}
          </For>
        </Select>

        <NumberInput
          label="Contrast"
          name="app.contrast"
          value={store.app.contrast}
          onInput={(e) =>
            setStore("app", "contrast", Number(e.currentTarget.value))
          }
          required
          step={0.1}
          max={1}
          min={-1}
        />

        <Select
          label="Mode"
          name="app.mode"
          value={store.app.mode}
          onInput={(e) => setStore("app", "mode", e.currentTarget.value)}
          required
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </Select>

        <Select
          label="Resize filter"
          name="app.resize_filter"
          value={store.app.resize_filter}
          onInput={(e) =>
            setStore("app", "resize_filter", e.currentTarget.value)
          }
          required
        >
          <For each={RESIZE_FILTERS}>
            {(items) => <option value={items.value}>{items.label}</option>}
          </For>
        </Select>

        <TextInput
          label="Fallback color"
          name="app.fallback_color"
          value={store.app.fallback_color}
          onInput={(e) =>
            setStore("app", "fallback_color", e.currentTarget.value)
          }
          type="color"
          required
        />

        <Select
          label="“Good” preferred color"
          name="app.prefer"
          value={store.app.prefer}
          onInput={(e) => setStore("app", "prefer", e.currentTarget.value)}
          required
        >
          <For each={GOOD_PREFER_COLORS}>
            {(items) => <option value={items.value}>{items.label}</option>}
          </For>
        </Select>
      </fieldset>

      <fieldset class="fieldset">
        <legend class="fieldset-legend">Templates</legend>

        <ul class="list bg-base-200 rounded-box">
          <For each={store.templates}>
            {(template, index) => (
              <li class="list-row items-center">
                <div class="list-col-grow">{template.key}</div>
                <TemplateEditModal
                  store={store}
                  setStore={setStore}
                  index={index()}
                  values={template}
                />
                <TemplateDeleteModal
                  store={store}
                  setStore={setStore}
                  index={index()}
                />
              </li>
            )}
          </For>
        </ul>
      </fieldset>

      <div class="flex gap-2">
        <button class="btn btn-primary w-fit" disabled={isSubmitting()}>
          <Show when={!isSubmitting()} fallback={<Spinner />}>
            Save
          </Show>
        </button>

        <TemplateModal store={store} setStore={setStore} />
      </div>
    </form>
  );
}
