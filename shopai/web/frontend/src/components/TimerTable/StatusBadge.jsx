import { Badge } from "@shopify/polaris";

const statusMap = {
  active: { status: "success", label: "Active" },
  scheduled: { status: "info", label: "Scheduled" },
  expired: { status: "critical", label: "Expired" },
  disabled: { status: "warning", label: "Disabled" },
};

export default function StatusBadge({ status }) {
  const config = statusMap[status] || statusMap.disabled;
  return <Badge status={config.status}>{config.label}</Badge>;
}