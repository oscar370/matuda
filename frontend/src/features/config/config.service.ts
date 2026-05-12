import { commands } from "@/lib/bindings";
import { unwrap } from "@/lib/utils";
import { query } from "@solidjs/router";

export const getConfig = query(() => unwrap(commands.getConfig()), "getConfig");

export function preloadConfig() {
  getConfig();
}
