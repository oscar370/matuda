import { TextInput } from "@/components/text-input";
import { ConfigTomlDto, TemplateItemDto } from "@/lib/bindings";
import { Pencil } from "lucide-solid";
import { createEffect } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";
import { Portal } from "solid-js/web";

type TemplateModalProps = {
  store: ConfigTomlDto;
  setStore: SetStoreFunction<ConfigTomlDto>;
  index: number;
  values: TemplateItemDto;
};

export function TemplateEditModal(props: TemplateModalProps) {
  let modalRef: HTMLDialogElement | undefined;
  const [draft, setDraft] = createStore<TemplateItemDto>({ ...props.values });

  createEffect(() => {
    setDraft({ ...props.values });
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (!draft.key || !draft.input_path) return;
    props.setStore("templates", props.index, draft);
    modalRef?.close();
  };

  return (
    <>
      <button
        aria-label="Edit template"
        class="btn btn-square btn-ghost tooltip tooltip-top font-normal"
        type="button"
        onClick={() => modalRef?.showModal()}
        data-tip="Edit template"
      >
        <Pencil class="size-5" />
      </button>

      <Portal>
        <dialog ref={(e) => (modalRef = e)} class="modal">
          <div class="modal-box">
            <h2 class="text-lg font-bold">Edit template</h2>

            <form class="py-4" onSubmit={handleSubmit}>
              <fieldset class="fieldset">
                <TextInput
                  label="Name"
                  name="key"
                  value={draft.key}
                  onInput={(e) => setDraft("key", e.currentTarget.value)}
                  required
                />
                <TextInput
                  label="Input path"
                  name="input_path"
                  value={draft.input_path}
                  onInput={(e) => setDraft("input_path", e.currentTarget.value)}
                  required
                />
                <TextInput
                  label="Output path"
                  name="output_path"
                  value={draft.output_path ?? ""}
                  onInput={(e) =>
                    setDraft("output_path", e.currentTarget.value || null)
                  }
                />
                <TextInput
                  label="Pre hook"
                  name="pre_hook"
                  value={draft.pre_hook ?? ""}
                  onInput={(e) => setDraft("pre_hook", e.currentTarget.value)}
                />
                <TextInput
                  label="Post hook"
                  name="post_hook"
                  value={draft.post_hook ?? ""}
                  onInput={(e) => setDraft("post_hook", e.currentTarget.value)}
                />
              </fieldset>

              <div class="modal-action">
                <button class="btn btn-primary" type="submit">
                  Save changes
                </button>

                <button
                  class="btn"
                  type="button"
                  onClick={() => modalRef?.close()}
                >
                  Close
                </button>
              </div>
            </form>
          </div>

          <form method="dialog" class="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </Portal>
    </>
  );
}
