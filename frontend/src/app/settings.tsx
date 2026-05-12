import { PageContainer } from "@/components/page-container";
import { AppActions } from "@/features/manager/app-actions";
import { CheckUpdates } from "@/features/manager/check-updates";

export default function Settings() {
  return (
    <PageContainer title="Settings">
      <CheckUpdates />
      <AppActions />
    </PageContainer>
  );
}
