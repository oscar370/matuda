import { PageContainer } from "@/components/page-container";
import { ConfigForm } from "@/features/config/config-form";

export default function Config() {
  return (
    <PageContainer title="Config">
      <ConfigForm />
    </PageContainer>
  );
}
