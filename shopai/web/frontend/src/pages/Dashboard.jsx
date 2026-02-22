import { useState, useEffect, useCallback } from "react";
import {
  Page,
  Layout,
  Card,
  Button,
  Text,
  Banner,
  Spinner,
  BlockStack,
} from "@shopify/polaris";
import { useAuthenticatedFetch } from "@shopify/app-bridge-react";
import { useNavigate } from "react-router-dom";
import TimerTable from "../components/TimerTable";

export default function Dashboard() {
  const fetch = useAuthenticatedFetch();
  const navigate = useNavigate();
  const [timers, setTimers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTimers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/timers");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTimers(data.timers);
    } catch (err) {
      setError(err.message || "Failed to load timers.");
    } finally {
      setLoading(false);
    }
  }, [fetch]);

  useEffect(() => { loadTimers(); }, [loadTimers]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this timer?")) return;
    try {
      await fetch(`/api/timers/${id}`, { method: "DELETE" });
      setTimers((prev) => prev.filter((t) => t._id !== id));
    } catch {
      setError("Failed to delete timer.");
    }
  };

  return (
    <Page
      title="Countdown Timers"
      primaryAction={{
        content: "Create Timer",
        onAction: () => navigate("/timers/new"),
      }}
    >
      <Layout>
        <Layout.Section>
          {error && (
            <Banner status="critical" onDismiss={() => setError(null)}>
              <p>{error}</p>
            </Banner>
          )}
          <Card padding="0">
            {loading ? (
              <div style={{ padding: 32, textAlign: "center" }}>
                <Spinner />
              </div>
            ) : (
              <TimerTable
                timers={timers}
                onDelete={handleDelete}
                loading={loading}
              />
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}