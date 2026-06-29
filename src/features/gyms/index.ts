/**
 * Gyms Feature Index
 */

export { gymsAPI, gymAreasAPI, default as gymsAPIDefault } from "./gyms.api";
export type {
  GymResponse,
  GymAnalytics,
  GymAreaResponse,
  GymCreateRequest,
  GymUpdateRequest,
  AddressUpdateRequest,
  BusinessSettingsUpdateRequest,
  GymAreaCreateRequest,
} from "./gyms.api";

export {
  gymKeys,
  gymAreaKeys,
  useGyms,
  useMyGyms,
  useActiveGyms,
  useGym,
  useCreateGym,
  useUpdateGym,
  useUpdateGymAddress,
  useUpdateGymBusinessSettings,
  useDeleteGym,
  useActivateGym,
  useDeactivateGym,
  useSuspendGym,
  useGymAnalytics,
  useOwnerAnalytics,
  useOwnerAnalytics as useGymStats, // Backward compatibility alias
  useGymAreas,
  useCreateGymArea,
  useUpdateGymArea,
  useDeleteGymArea,
} from "./gyms.hooks";
