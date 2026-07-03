import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react-native';
import React from 'react';
import { ThemeProvider } from '../theme/ThemeContext';

/** Renders UI with the app's providers, using a fresh QueryClient per test. */
export function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    // retry off for deterministic error tests; Infinity gcTime avoids stray timers in Jest
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });

  // RNTL v14 render is async; callers await the returned promise.
  return render(
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </ThemeProvider>,
  );
}
