import { useState } from "react";
import {
  Card,
  FormLayout,
  TextField,
  Select,
  Button,
  Divider,
  BlockStack,
  Text,
  InlineStack,
  Banner,
} from "@shopify/polaris";
import { useAuthenticatedFetch } from "@shopify/app-bridge-react";
import { useNavigate } from "react-router-dom";
import AppearanceSection from "./AppearanceSection";
import TargetingSection from "./TargetingSection";
import AIModal from "./AIModal";

const defaultForm = {
  name: "",
  type: "fixed",
  startDate: "",
  endDate: "",
  durationHours: "",
  targeting: { type: "all", resourceIds: [] },
  appearance: {
    backgroundColor: "#FF4444",
    textColor: "#FFFFFF",
    position: "top",
    headline: "Sale Ends In",
    supportingText: "",
  },
};

export default function TimerForm({ initialData, timerId }) {
  const fetch = useAuthenticatedFetch();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialData || defaultForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiSuggested, setAiSuggested] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const update = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (form.type === "fixed") {
      if (!form.startDate) e.startDate = "Start date is required.";
      if (!form.endDate) e.endDate = "End date is required.";
      if (form.startDate && form.endDate && form.endDate <= form.startDate)
        e.endDate = "End date must be after start date.";
    }
    if (form.type === "evergreen") {
      if (!form.durationHours || Number(form.durationHours) <= 0)
        e.durationHours = "Duration must be a positive number.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    setSaveError(null);

    try {
      const url = timerId ? `/api/timers/${timerId}` : "/api/timers";
      const method = timerId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, aiGenerated: aiSuggested }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save timer.");
      navigate("/");
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAiApply = (suggestion) => {
    setForm((f) => ({
      ...f,
      type: suggestion.timer_type || f.type,
      durationHours: suggestion.duration_hours?.toString() || f.durationHours,
      appearance: {
        ...f.appearance,
        headline: suggestion.headline || f.appearance.headline,
        supportingText: suggestion.supporting_text || f.appearance.supportingText,
      },
    }));
    setAiSuggested(true);
  };

  return (
    <BlockStack gap="600">
      {saveError && (
        <Banner status="critical" onDismiss={() => setSaveError(null)}>
          <p>{saveError}</p>
        </Banner>
      )}

      <Card>
        <BlockStack gap="400">
          <InlineStack align="space-between">
            <Text variant="headingMd">Timer Settings</Text>
            <Button onClick={() => setAiOpen(true)} variant="plain" tone="magic">
              ✦ Generate with AI
            </Button>
          </InlineStack>

          <FormLayout>
            <TextField
              label="Timer Name"
              value={form.name}
              onChange={update("name")}
              error={errors.name}
              autoComplete="off"
              placeholder="e.g. Black Friday Flash Sale"
            />

            <Select
              label="Timer Type"
              options={[
                { label: "Fixed (same for all users)", value: "fixed" },
                { label: "Evergreen (per-session)", value: "evergreen" },
              ]}
              value={form.type}
              onChange={update("type")}
            />

            {form.type === "fixed" && (
              <>
                <TextField
                  label="Start Date & Time"
                  type="datetime-local"
                  value={form.startDate}
                  onChange={update("startDate")}
                  error={errors.startDate}
                  autoComplete="off"
                />
                <TextField
                  label="End Date & Time"
                  type="datetime-local"
                  value={form.endDate}
                  onChange={update("endDate")}
                  error={errors.endDate}
                  autoComplete="off"
                />
              </>
            )}

            {form.type === "evergreen" && (
              <TextField
                label="Duration (hours)"
                type="number"
                value={form.durationHours}
                onChange={update("durationHours")}
                error={errors.durationHours}
                min="0.1"
                max="720"
                autoComplete="off"
                helpText="Timer resets per user session after this duration."
              />
            )}
          </FormLayout>
        </BlockStack>
      </Card>

      <Card>
        <BlockStack gap="400">
          <Text variant="headingMd">Targeting</Text>
          <TargetingSection
            targeting={form.targeting}
            onChange={update("targeting")}
          />
        </BlockStack>
      </Card>

      <Card>
        <BlockStack gap="400">
          <Text variant="headingMd">Appearance</Text>
          <AppearanceSection
            appearance={form.appearance}
            onChange={update("appearance")}
            aiSuggested={aiSuggested}
          />
        </BlockStack>
      </Card>

      <InlineStack align="end" gap="300">
        <Button onClick={() => navigate("/")} disabled={saving}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} loading={saving}>
          {timerId ? "Save Changes" : "Create Timer"}
        </Button>
      </InlineStack>

      <AIModal
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        productTitle={form.targeting?.selectedTitle || ""}
        productCategory=""
        onApply={handleAiApply}
      />
    </BlockStack>
  );
}