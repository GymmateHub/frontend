import type { ReactElement, ReactNode } from "react";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { HelmetProvider } from "react-helmet-async";

export function renderWithProviders(ui: ReactElement, { route = "/" }: { route?: string } = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  // `wrapper` (rather than wrapping `ui`) keeps the providers on `rerender`.
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
  return { queryClient, ...render(ui, { wrapper: Wrapper }) };
}

export function makeGym(overrides: Record<string, unknown> = {}) {
  return {
    id: "gym-1",
    organisationId: "org-1",
    name: "Iron Temple",
    description: "Best gym",
    contactEmail: "owner@example.com",
    contactPhone: "+2348000000000",
    website: "https://irontemple.example.com",
    logoUrl: null,
    address: { street: "1 Lagos Way", city: "Lagos", state: "LA", postalCode: "100001", country: "Nigeria" },
    currency: "NGN",
    timezone: "Africa/Lagos",
    businessHours: null,
    status: "ACTIVE",
    active: true,
    createdAt: "2026-01-01T00:00:00",
    updatedAt: "2026-01-01T00:00:00",
    ...overrides,
  };
}

/** Last element of a non-empty query result (e.g. the submit button of a dialog that repeats the trigger's label). */
export function lastOf<T>(items: T[]): T {
  return items[items.length - 1];
}
