import { commands } from "@/lib/bindings";
import { unwrap } from "@/lib/utils";
import { query } from "@solidjs/router";

export const getIsAppInit = query(
  () => unwrap(commands.isInitApp()),
  "isAppInit",
);

export function preloadIsAppInit() {
  getIsAppInit();
}
