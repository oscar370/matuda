import { commands } from "@/lib/bindings";
import { unwrap } from "@/lib/utils";
import { query } from "@solidjs/router";

export const getServiceStatus = query(
  () => unwrap(commands.getServiceStatus()),
  "serviceStatus",
);

export function preloadServiceStatus() {
  getServiceStatus();
}
