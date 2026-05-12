import { ErrorContent } from "@/components/error-content";
import { createResource, ErrorBoundary, onCleanup, onMount } from "solid-js";
import { getServiceStatus } from "./service.service";

export function ServiceStatus() {
  const [serviceStatus, { refetch }] = createResource(() => getServiceStatus());

  onMount(() => {
    window.addEventListener("service-updated", refetch);
    onCleanup(() => window.removeEventListener("service-updated", refetch));
  });

  return (
    <section class="space-y-2">
      <div class="mockup-code w-full" aria-label="service status">
        <ErrorBoundary fallback={<ErrorContent />}>
          <pre class="px-2 whitespace-pre-wrap">{serviceStatus()}</pre>
        </ErrorBoundary>
      </div>

      <button class="btn btn-primary" onClick={refetch}>
        Refresh status
      </button>
    </section>
  );
}
