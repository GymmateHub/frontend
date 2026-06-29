/**
 * Equipment Feature Index
 * Re-exports for convenient imports
 */

// API
export { equipmentAPI, maintenanceAPI, default as equipmentAPIDefault } from "./equipment.api";
export type {
  Equipment,
  EquipmentResponse,
  EquipmentCreateRequest,
  MaintenanceScheduleResponse,
  MaintenanceRecordResponse,
  MaintenanceScheduleCreateRequest,
  MaintenanceRecordCreateRequest,
} from "./equipment.api";

// Hooks
export {
  equipmentKeys,
  maintenanceKeys,
  useEquipmentByOrganisation,
  useEquipment,
  useActiveEquipment,
  useEquipmentById,
  useCreateEquipment,
  useUpdateEquipment,
  useUpdateEquipmentStatus,
  useDeleteEquipment,
  useEquipmentMaintenanceDue,
  usePendingMaintenanceSchedules,
  useDueMaintenanceSchedules,
  useCreateMaintenanceSchedule,
  useRescheduleMaintenance,
  useCompleteMaintenanceSchedule,
  useMaintenanceRecordsByGym,
  useMaintenanceRecordsByEquipment,
  useCreateMaintenanceRecord,
  useEquipmentStats,
} from "./equipment.hooks";


