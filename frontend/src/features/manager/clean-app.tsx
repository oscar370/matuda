import { Spinner } from "@/components/spinner";
import { commands } from "@/lib/bindings";
import { unwrap } from "@/lib/utils";
import { useNavigate } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { toast } from "solid-sonner";

export function CleanApp() {
  const [isPending, setIsPending] = createSignal(false);
  const navigate = useNavigate();
  let modalRef: HTMLDialogElement | undefined;

  async function handleClean() {
    try {
      setIsPending(true);
      await unwrap(commands.cleanApp());
      toast.success("The app has been cleaned up");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while cleaning up the app");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <button class="btn btn-error" onClick={() => modalRef?.showModal()}>
        <Show when={!isPending()} fallback={<Spinner />}>
          Clean app
        </Show>
      </button>

      <dialog ref={(e) => (modalRef = e)} class="modal">
        <div class="modal-box">
          <h2 class="text-lg font-bold">Clean app?</h2>
          <p class="py-4">
            This will remove the service, the binaries, and other configuration
            files
          </p>

          <div class="modal-action">
            <button class="btn btn-error" onClick={handleClean}>
              Clean
            </button>
            <button class="btn" onClick={() => modalRef?.close()}>
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
