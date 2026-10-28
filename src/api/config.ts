export function getApiOrigin(): string {
  const origin = process.env.EXPO_PUBLIC_API_URL;
  if (!origin) {
    throw new Error("EXPO_PUBLIC_API_URL is required");
  }
  return origin;
}
