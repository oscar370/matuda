import { ConfigTomlDto } from "@/lib/bindings";
import { Trash } from "lucide-solid";
import { SetStoreFunction } from "solid-js/store";
import { Portal } from "solid-js/web";

type TemplateModalProps = {
  store: ConfigTomlDto;
  setStore: SetStoreFunction<ConfigTomlDto>;
  index: number;
};

export function TemplateDeleteModal(props: TemplateModalProps) {
  let modalRef: HTMLDialogElement | undefined;

  function handleDelete() {
    props.setStore("templates", (templates) =>
      templates.filter((_, i) => i !== props.index),
    );
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

      <Portal>
        <dialog ref={(e) => (modalRef = e)} class="modal">
          <div class="modal-box">
            <h2 class="text-lg font-bold">Delete template?</h2>

            <p class="py-4">
              The deletion will not take effect until you save your changes.
            </p>

            <div class="modal-action">
              <button
                class="btn btn-error"
                type="button"
                onClick={handleDelete}
              >
                Confirm
              </button>

              <button
                class="btn"
                type="button"
                onClick={() => modalRef?.close()}
              >
                Close
              </button>
            </div>
          </div>

          <form method="dialog" class="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </Portal>
    </>
  );
}
