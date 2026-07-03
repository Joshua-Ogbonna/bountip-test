import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';

const ONE_HOUR = 60 * 60 * 1000;
const ONE_DAY = 24 * ONE_HOUR;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: ONE_DAY, // keep cached data long enough to survive offline restarts
      retry: 1,
    },
  },
});

/** Persists the query cache to AsyncStorage so the catalogue works offline. */
export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'product-catalogue-cache',
});

export const CACHE_MAX_AGE = ONE_DAY;
