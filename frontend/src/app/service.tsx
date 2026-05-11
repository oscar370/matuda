import { PageContainer } from "@/components/page-container";
import { ServiceActions } from "@/features/service/service-actions";
import { ServiceStatus } from "@/features/service/service-status";

export default function Service() {
  return (
    <PageContainer title="Service">
      <div class="mx-auto">
        <ServiceActions />
      </div>
      <ServiceStatus />
    </PageContainer>
  );
}
