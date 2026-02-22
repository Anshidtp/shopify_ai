import {
  IndexTable,
  Text,
  Button,
  ButtonGroup,
  EmptyState,
} from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export default function TimerTable({ timers, onDelete, loading }) {
  const navigate = useNavigate();

  if (!loading && timers.length === 0) {
    return (
      <EmptyState
        heading="No timers yet"
        action={{
          content: "Create your first timer",
          onAction: () => navigate("/timers/new"),
        }}
        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
      >
        <p>Create a countdown timer to drive urgency on your product pages.</p>
      </EmptyState>
    );
  }

  const resourceName = { singular: "timer", plural: "timers" };
  const headings = [
    { title: "Name" },
    { title: "Type" },
    { title: "Status" },
    { title: "Impressions" },
    { title: "Actions" },
  ];

  return (
    <IndexTable
      resourceName={resourceName}
      itemCount={timers.length}
      headings={headings}
      selectable={false}
      loading={loading}
    >
      {timers.map((timer) => (
        <IndexTable.Row key={timer._id} id={timer._id}>
          <IndexTable.Cell>
            <Text variant="bodyMd" fontWeight="semibold">
              {timer.name}
            </Text>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <Text variant="bodyMd" as="span" color="subdued">
              {timer.type === "fixed" ? "Fixed" : "Evergreen"}
            </Text>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <StatusBadge status={timer.status} />
          </IndexTable.Cell>
          <IndexTable.Cell>{timer.impressions ?? 0}</IndexTable.Cell>
          <IndexTable.Cell>
            <ButtonGroup>
              <Button
                size="slim"
                onClick={() => navigate(`/timers/${timer._id}/edit`)}
              >
                Edit
              </Button>
              <Button
                size="slim"
                destructive
                onClick={() => onDelete(timer._id)}
              >
                Delete
              </Button>
            </ButtonGroup>
          </IndexTable.Cell>
        </IndexTable.Row>
      ))}
    </IndexTable>
  );
}