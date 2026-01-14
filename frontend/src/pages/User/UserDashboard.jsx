import StatusSection from "./StatusSection";
import AdvisorySection from "./AdvisorySection";
import ImpactSection from "./ImpactSection";
import NotificationsSection from "./NotificationsSection";

export default function UserDashboard() {
  return (
    <div style={{ padding: 20, display: "grid", gap: 20 }}>
      <StatusSection />
      <AdvisorySection />
      <ImpactSection />
      <NotificationsSection />
    </div>
  );
}
