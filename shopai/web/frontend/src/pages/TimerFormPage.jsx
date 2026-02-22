import { useState, useEffect } from "react";
import { Page, Layout, Spinner } from "@shopify/polaris";
import { useAuthenticatedFetch } from "@shopify/app-bridge-react";
import { useParams, useNavigate } from "react-router-dom";
import TimerForm from "../components/TimerForm";

export default function TimerFormPage() {
  const { id } = useParams();
  const fetch = useAuthenticatedFetch();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/timers/${id}`)
      .then((r) => r.json())
      .then((data) => setInitialData(data.timer))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <Page
      title={id ? "Edit Timer" : "Create Timer"}
      breadcrumbs={[{ content: "Timers", url: "/" }]}
    >
      <Layout>
        <Layout.Section>
          {loading ? (
            <div style={{ textAlign: "center", padding: 48 }}>
              <Spinner />
            </div>
          ) : (
            <TimerForm initialData={initialData} timerId={id} />
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );
}