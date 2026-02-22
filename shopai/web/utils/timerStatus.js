export const computeStatus = (timer) => {
  if (!timer.isActive) return "disabled";
  if (timer.type === "evergreen") return "active";
  const now = new Date();
  if (timer.startDate && now < new Date(timer.startDate)) return "scheduled";
  if (timer.endDate && now > new Date(timer.endDate)) return "expired";
  return "active";
};

export const isTimerActiveForNow = (timer) => {
  return computeStatus(timer) === "active";
};