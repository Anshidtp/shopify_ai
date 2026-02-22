import { escape } from "html-escaper";

export const sanitizeString = (str) => {
  if (typeof str !== "string") return "";
  return escape(str.trim());
};

export const sanitizeColor = (color) => {
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexPattern.test(color) ? color : "#000000";
};

export const sanitizeTimerInput = (body) => {
  return {
    name: sanitizeString(body.name),
    type: ["fixed", "evergreen"].includes(body.type) ? body.type : "fixed",
    startDate: body.startDate ? new Date(body.startDate) : undefined,
    endDate: body.endDate ? new Date(body.endDate) : undefined,
    durationHours: body.durationHours
      ? Math.min(720, Math.max(0.1, Number(body.durationHours)))
      : undefined,
    targeting: {
      type: ["all", "products", "collections"].includes(body.targeting?.type)
        ? body.targeting.type
        : "all",
      resourceIds: Array.isArray(body.targeting?.resourceIds)
        ? body.targeting.resourceIds.slice(0, 50).map(String)
        : [],
    },
    appearance: {
      backgroundColor: sanitizeColor(body.appearance?.backgroundColor),
      textColor: sanitizeColor(body.appearance?.textColor),
      position: ["top", "bottom"].includes(body.appearance?.position)
        ? body.appearance.position
        : "top",
      headline: sanitizeString(body.appearance?.headline).slice(0, 60),
      supportingText: sanitizeString(body.appearance?.supportingText).slice(
        0,
        120
      ),
    },
  };
};