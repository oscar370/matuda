import { ConfigTomlDto } from "@/lib/bindings";
import { FormStore, remove } from "@modular-forms/solid";
import { Trash } from "lucide-solid";

type TemplateModalProps = {
  form: FormStore<ConfigTomlDto, undefined>;
  index: number;
};

export function TemplateDeleteModal(props: TemplateModalProps) {
  let modalRef: HTMLDialogElement | undefined;

  function handleDelete() {
    remove(props.form, "templates", { at: props.index });
    modalRef?.close();
  }

  return (
    <>
      <button
        aria-label="Delete template"
        class="btn btn-square btn-ghost tooltip tooltip-top font-normal"
        type="button"
        onClick={() => modalRef?.showModal()}
        data-tip="Delete template"
      >
        <Trash class="size-5" />
      </button>

      <dialog ref={(e) => (modalRef = e)} class="modal">
        <div class="modal-box">
          <h2 class="text-lg font-bold">Delete template?</h2>

          <p class="py-4">This action cannot be undone.</p>

          <div class="modal-action">
            <button class="btn btn-error" type="submit" onClick={handleDelete}>
              Confirm
            </button>

            <button class="btn" type="button" onClick={() => modalRef?.close()}>
              Close
            </button>
          </div>
        </div>

        <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
