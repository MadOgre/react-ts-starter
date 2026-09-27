import type { AxiosAdapter } from "axios";

const MOCK_DELAY_MS = 500;

// MOCK: per-request axios adapter that answers with fixed data after a short delay, so loading states show.
// Delete this file once no API Function uses it.
export const mockAdapter = (data: unknown): AxiosAdapter => (config) =>
  new Promise((resolve) => {
    setTimeout(() => resolve({ data, status: 200, statusText: "OK", headers: {}, config }), MOCK_DELAY_MS);
  });
