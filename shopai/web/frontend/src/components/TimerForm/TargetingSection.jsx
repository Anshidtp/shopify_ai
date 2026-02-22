import { ChoiceList, Button, BlockStack, Text, InlineStack, Tag } from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { useState } from "react";

export default function TargetingSection({ targeting, onChange }) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleTypeChange = ([value]) => {
    onChange({ type: value, resourceIds: [] });
  };

  const handlePickerSelect = ({ selection }) => {
    const ids = selection.map((item) => item.id);
    onChange({ ...targeting, resourceIds: ids });
    setPickerOpen(false);
  };

  return (
    <BlockStack gap="400">
      <ChoiceList
        title="Apply timer to"
        choices={[
          { label: "All Products", value: "all" },
          { label: "Specific Products", value: "products" },
          { label: "Specific Collections", value: "collections" },
        ]}
        selected={[targeting.type]}
        onChange={handleTypeChange}
      />

      {targeting.type !== "all" && (
        <BlockStack gap="200">
          <Button onClick={() => setPickerOpen(true)}>
            {targeting.type === "products"
              ? "Select Products"
              : "Select Collections"}
          </Button>
          <InlineStack gap="200" wrap>
            {targeting.resourceIds.map((id) => (
              <Tag
                key={id}
                onRemove={() =>
                  onChange({
                    ...targeting,
                    resourceIds: targeting.resourceIds.filter((r) => r !== id),
                  })
                }
              >
                {id.split("/").pop()}
              </Tag>
            ))}
          </InlineStack>
        </BlockStack>
      )}

      {pickerOpen && (
        <ResourcePicker
          resourceType={targeting.type === "products" ? "Product" : "Collection"}
          open={pickerOpen}
          onSelection={handlePickerSelect}
          onCancel={() => setPickerOpen(false)}
          allowMultiple
        />
      )}
    </BlockStack>
  );
}