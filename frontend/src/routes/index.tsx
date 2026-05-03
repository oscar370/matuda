import { Show } from "solid-js";
import { PageContainer } from "~/components/page-container";
import { InitApp } from "~/features/manager/init-app";
import { ServiceStatus } from "~/features/manager/service-status";
import { appStore } from "~/stores/app-store";

export default function Home() {
  return (
    <PageContainer title="Home">
      <Show when={appStore.isAppInit} fallback={<InitApp />}>
        <ServiceStatus />
      </Show>
    </PageContainer>
  );
}
