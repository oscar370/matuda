import { ErrorContent } from "@/components/error-content";
import { Spinner } from "@/components/spinner";
import { createResource, ErrorBoundary, Suspense } from "solid-js";
import { getServiceStatus } from "./service.service";

export function ServiceStatus() {
  const [serviceStatus, { refetch }] = createResource(() => getServiceStatus());

  return (
    <section class="space-y-2">
      <div class="mockup-code w-full" aria-label="service status">
        <ErrorBoundary fallback={<ErrorContent />}>
          <Suspense fallback={<Spinner />}>
            <code class="flex items-center justify-center px-4">
              {serviceStatus()}
            </code>
          </Suspense>
        </ErrorBoundary>
      </div>

      <button class="btn btn-primary" onClick={refetch}>
        Refresh status
      </button>
    </section>
  );
}
