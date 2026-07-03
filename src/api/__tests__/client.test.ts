import { ApiError, apiGet } from '../client';

describe('apiGet', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('returns parsed JSON for a successful response', async () => {
    const payload = [{ id: 1, title: 'Backpack' }];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => payload,
    }) as jest.Mock;

    await expect(apiGet('/products')).resolves.toEqual(payload);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://fakestoreapi.com/products',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it('throws an ApiError carrying the HTTP status for non-2xx responses', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 }) as jest.Mock;

    const error = await apiGet('/products').catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(500);
  });

  it('wraps network failures in a user-friendly ApiError', async () => {
    global.fetch = jest.fn().mockRejectedValue(new TypeError('Network request failed')) as jest.Mock;

    await expect(apiGet('/products')).rejects.toThrow(
      'Network request failed. Please check your connection.',
    );
  });
});
