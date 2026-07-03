import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface FavoritesState {
  ids: number[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

/**
 * Client-only state (favourites) lives in Zustand; server state stays in
 * TanStack Query. Persisted so favourites survive app restarts.
 */
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggleFavorite: (id) =>
        set((state) => ({
          ids: state.ids.includes(id)
            ? state.ids.filter((storedId) => storedId !== id)
            : [...state.ids, id],
        })),
      isFavorite: (id) => get().ids.includes(id),
    }),
    {
      name: 'favorites',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
