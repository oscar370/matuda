import { InitApp } from "@/features/manager/init-app";
import { getIsAppInit } from "@/features/manager/manager.service";
import { createAsync, useNavigate } from "@solidjs/router";
import { createEffect } from "solid-js";

export default function Home() {
  const isAppInit = createAsync(() => getIsAppInit());
  const navigate = useNavigate();

  createEffect(() => {
    if (isAppInit()) navigate("/service", { replace: true });
  });

  return (
    <main class="flex h-dvh w-full flex-col items-center justify-center gap-1">
      <span>This will download the binaries and configure Matugen</span>
      <InitApp />
    </main>
  );
}
