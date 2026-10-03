export function formatViews(count = 0) {
  const num = Number(count) || 0;
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M reads`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}k reads`;
  }
  return `${num} ${num === 1 ? "read" : "reads"}`;
}
