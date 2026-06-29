/**
 * Classes Feature Index
 * Re-exports for convenient imports
 */

// API
export { classesAPI, default as classesAPIDefault } from "./classes.api";
export type {
  Class,
  ClassResponse,
  ClassScheduleResponse,
  ClassCategoryResponse,
  ClassCreateRequest,
  ClassScheduleCreateRequest,
  ClassCategoryCreateRequest,
} from "./classes.api";

// Hooks
export {
  classKeys,
  useClasses,
  useClass,
  useCreateClass,
  useUpdateClass,
  useDeleteClass,
  useClassSchedules,
  useCreateClassSchedule,
  useUpdateClassSchedule,
  useDeleteClassSchedule,
  useClassCategories,
  useCreateClassCategory,
  useClassStats,
} from "./classes.hooks";


