import { Routes, Route } from "react-router-dom";
import { AppProvider } from "@shopify/polaris";
import { Provider as AppBridgeProvider } from "@shopify/app-bridge-react";
import enTranslations from "@shopify/polaris/locales/en.json";
import Dashboard from "./pages/Dashboard";
import TimerFormPage from "./pages/TimerFormPage";

const apiKey = import.meta.env.VITE_SHOPIFY_API_KEY || "";

export default function App() {
  const config = {
    apiKey,
    host: new URLSearchParams(location.search).get("host") || "",
    forceRedirect: true,
  };

  return (
    <AppProvider i18n={enTranslations}>
      <AppBridgeProvider config={config}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/timers/new" element={<TimerFormPage />} />
          <Route path="/timers/:id/edit" element={<TimerFormPage />} />
        </Routes>
      </AppBridgeProvider>
    </AppProvider>
  );
}