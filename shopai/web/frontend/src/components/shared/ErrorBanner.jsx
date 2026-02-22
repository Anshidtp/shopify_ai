import { Banner } from "@shopify/polaris";

export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <Banner status="critical" onDismiss={onDismiss} title="Something went wrong">
      <p>{message}</p>
    </Banner>
  );
}