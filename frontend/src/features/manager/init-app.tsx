import { Spinner } from "@/components/spinner";
import { commands } from "@/lib/bindings";
import { unwrap } from "@/lib/utils";
import { setAppStore } from "@/stores/app-store";
import { useNavigate } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { toast } from "solid-sonner";

export function InitApp() {
  const navigate = useNavigate();
  const [isPending, setIsPending] = createSignal(false);

  async function handleInitApp() {
    try {
      setIsPending(true);
      const res = await unwrap(commands.initApp());
      setAppStore(res);
      navigate("/service");
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while trying to initialize the app");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      class="btn btn-primary"
      disabled={isPending()}
      onClick={handleInitApp}
    >
      <Show when={!isPending()} fallback={<Spinner />}>
        Init app
      </Show>
    </button>
  );
}
