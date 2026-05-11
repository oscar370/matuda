import { AppVersions } from "@/lib/bindings";
import { makePersisted } from "@solid-primitives/storage";
import { createStore } from "solid-js/store";

type AppState = AppVersions;

const INITIAL_STATE: AppState = {
  daemon: "",
  matugen: "",
};

export const [appStore, setAppStore] = makePersisted(
  createStore(INITIAL_STATE),
  { name: "app_store" },
);
