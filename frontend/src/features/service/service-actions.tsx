import { commands } from "@/lib/bindings";
import { unwrap } from "@/lib/utils";
import { createSignal } from "solid-js";
import { toast } from "solid-sonner";

export function ServiceActions() {
  const [isPending, setIsPending] = createSignal(false);

  async function handleOperation(operation: () => Promise<unknown>) {
    try {
      setIsPending(true);
      await operation();
      toast.success("The action has been completed");
    } catch (error) {
      console.log(error);
      toast.error("Failed to perform the action");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div class="join join-vertical md:join-horizontal">
      <button
        class="btn join-item"
        disabled={isPending()}
        onClick={() => handleOperation(() => unwrap(commands.startService()))}
      >
        Start service
      </button>
      <button
        class="btn join-item"
        disabled={isPending()}
        onClick={() => handleOperation(() => unwrap(commands.stopService()))}
      >
        Stop service
      </button>
      <button
        class="btn join-item"
        disabled={isPending()}
        onClick={() => handleOperation(() => unwrap(commands.restartService()))}
      >
        Restart service
      </button>
    </div>
  );
}
