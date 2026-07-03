const BASE_URL = 'https://fakestoreapi.com';
const REQUEST_TIMEOUT_MS = 12_000;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Minimal typed GET wrapper around fetch with a request timeout,
 * so a dead network fails fast instead of hanging the UI.
 */
export async function apiGet<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${BASE_URL}${path}`, { signal: controller.signal });
    if (!response.ok) {
      throw new ApiError(`Request failed with status ${response.status}`, response.status);
    }
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timed out. Please check your connection.');
    }
    throw new ApiError('Network request failed. Please check your connection.');
  } finally {
    clearTimeout(timeout);
  }
}
