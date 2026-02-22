import { TextField, Select, BlockStack, InlineStack, Text } from "@shopify/polaris";

export default function AppearanceSection({ appearance, onChange, aiSuggested = false }) {
  const update = (key) => (value) => onChange({ ...appearance, [key]: value });

  return (
    <BlockStack gap="400">
      {aiSuggested && (
        <Text variant="bodySm" color="magic">
          ✦ Suggested by AI — review and edit before saving
        </Text>
      )}

      <TextField
        label="Headline"
        value={appearance.headline}
        onChange={update("headline")}
        maxLength={60}
        showCharacterCount
        autoComplete="off"
      />

      <TextField
        label="Supporting Text"
        value={appearance.supportingText}
        onChange={update("supportingText")}
        maxLength={120}
        showCharacterCount
        multiline={2}
        autoComplete="off"
      />

      <InlineStack gap="400">
        <div>
          <Text variant="bodyMd">Background Color</Text>
          <input
            type="color"
            value={appearance.backgroundColor}
            onChange={(e) => update("backgroundColor")(e.target.value)}
            style={{ width: 48, height: 36, cursor: "pointer", border: "none" }}
          />
        </div>
        <div>
          <Text variant="bodyMd">Text Color</Text>
          <input
            type="color"
            value={appearance.textColor}
            onChange={(e) => update("textColor")(e.target.value)}
            style={{ width: 48, height: 36, cursor: "pointer", border: "none" }}
          />
        </div>
      </InlineStack>

      <Select
        label="Position on page"
        options={[
          { label: "Top of product section", value: "top" },
          { label: "Bottom of product section", value: "bottom" },
        ]}
        value={appearance.position}
        onChange={update("position")}
      />
    </BlockStack>
  );
}