import { Frame, Navigation } from "@shopify/polaris";
import { ClockMajor, AnalyticsMajor } from "@shopify/polaris-icons";
import { useNavigate } from "react-router-dom";

export default function PageWrapper({ children }) {
  const navigate = useNavigate();
  return (
    <Frame>
      {children}
    </Frame>
  );
}