import { Spinner } from "@/components/spinner";
import { commands } from "@/lib/bindings";
import { unwrap } from "@/lib/utils";
import { appStore, setAppStore } from "@/stores/app-store";
import { createSignal, Show } from "solid-js";
import { toast } from "solid-sonner";

export function CheckUpdates() {
  const [isChecking, setIsChecking] = createSignal(false);

  async function handleCheck() {
    try {
      setIsChecking(true);
      const res = await unwrap(commands.checkUpdates());

      if (res.daemon.version !== appStore.daemon) {
        await unwrap(commands.installDaemon(res.daemon.url));
        setAppStore({ daemon: res.daemon.version });
      }

      if (res.matugen.version !== appStore.matugen) {
        await unwrap(commands.installMatugen(res.matugen.url));
        setAppStore({ matugen: res.matugen.version });
      }
    } catch (error) {
      console.log(error);
      toast.error(
        "An error occurred while verifying and installing the new versions",
      );
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <section class="space-y-2">
      <h2 class="font-bold">Updates</h2>

      <ul class="list bg-base-200 rounded-box">
        <li class="list-row">
          <div class="list-col-grow">Daemon version</div>

          <div class="badge badge-info">{appStore.daemon}</div>
        </li>
        <li class="list-row">
          <div class="list-col-grow">Matugen version</div>

          <div class="badge badge-info">{appStore.matugen}</div>
        </li>
      </ul>

      <button class="btn" disabled={isChecking()} onClick={handleCheck}>
        <Show when={!isChecking()} fallback={<Spinner />}>
          Check updates and install
        </Show>
      </button>
    </section>
  );
}
