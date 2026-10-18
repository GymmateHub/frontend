import { useEffect } from "react";
import { useAuth } from "@/auth/auth.store";
import { tokenStorage } from "@/api/axios";
import { useMyGyms } from "./gyms.hooks";
import type { GymResponse } from "./gyms.api";

/**
 * The gym the dashboard is currently working on.
 *
 * Prefers the gym in the auth token; falls back to the first gym in the organisation so
 * pages keep working for accounts whose token predates gym resolution (or has no gym).
 */
export function useActiveGym() {
  const { user } = useAuth();
  const { data, isLoading } = useMyGyms();
  const gyms = (data ?? []) as GymResponse[];
  const gym = gyms.find((g) => g.id === user?.gymId) ?? gyms[0];

  const resolvedGymId = gym?.id;
  useEffect(() => {
    // Tell the API which gym we are working on (X-Gym-Id) even when the login token
    // carries no gym, so gym-scoped endpoints don't fail with "gym required".
    if (resolvedGymId && tokenStorage.getCurrentGym() !== resolvedGymId) {
      tokenStorage.setCurrentGym(resolvedGymId);
    }
  }, [resolvedGymId]);

  return {
    gyms,
    gym,
    gymId: gym?.id ?? user?.gymId ?? "",
    isLoading,
  };
}
