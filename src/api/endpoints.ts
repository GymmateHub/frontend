/**
 * API Endpoints Configuration
 * Centralized endpoint constants for the GymMate API
 */

export const AUTH = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  REGISTER_OWNER: "/auth/register/owner",
  REGISTER_MEMBER: "/auth/register/member",
  VERIFY_OTP: "/auth/register/verify-otp",
  RESEND_OTP: "/auth/register/resend-otp",
  PASSWORD_RESET_REQUEST: "/auth/password-reset/request",
  PASSWORD_RESET_CONFIRM: "/auth/password-reset/confirm",
  SWITCH_GYM: (gymId: string) => `/auth/switch-gym/${gymId}`,
  CURRENT_GYM: "/auth/current-gym",
} as const;

export const ADMIN = {
  OVERVIEW: "/admin/overview",
  ORGANISATIONS: "/admin/organisations",
} as const;

export const ORGANISATIONS = {
  CURRENT: "/organisations/current",
  USAGE: "/organisations/current/usage",
  GYMS: "/organisations/current/gyms",
  GYMS_ACTIVE: "/organisations/current/gyms/active",
  COMPLETE_ONBOARDING: "/organisations/current/complete-onboarding",
} as const;

export const GYMS = {
  BASE: "/gyms",
  BY_ID: (id: string) => `/gyms/${id}`,
  REGISTER: "/gyms/register",
  MY_GYMS: "/gyms/my-gyms",
  ACTIVE: "/gyms/active",
  ANALYTICS: "/gyms/analytics",
  GYM_ANALYTICS: (gymId: string) => `/gyms/${gymId}/analytics`,
  ADDRESS: (id: string) => `/gyms/${id}/address`,
  SUBSCRIPTION: (id: string) => `/gyms/${id}/subscription`,
  BUSINESS_SETTINGS: (id: string) => `/gyms/${id}/business-settings`,
  ACTIVATE: (id: string) => `/gyms/${id}/activate`,
  DEACTIVATE: (id: string) => `/gyms/${id}/deactivate`,
  SUSPEND: (id: string) => `/gyms/${id}/suspend`,
  LOGO: (id: string) => `/gyms/${id}/logo`,
  WEBSITE: (id: string) => `/gyms/${id}/website`,
  COMPLETE_ONBOARDING: (id: string) => `/gyms/${id}/complete-onboarding`,
  BY_CITY: (city: string) => `/gyms/city/${city}`,
  SUBSCRIPTION_EXPIRED: (id: string) => `/gyms/${id}/subscription/expired`,
} as const;

export const MEMBERS = {
  BASE: "/members",
  BY_ID: (id: string) => `/members/${id}`,
  ACTIVE: "/members/active",
  ORGANISATION: "/members/organisation",
  BY_GYM: (gymId: string) => `/members/gym/${gymId}`,
  BY_STATUS: (status: string) => `/members/status/${status}`,
  BY_USER: (userId: string) => `/members/user/${userId}`,
  BY_MEMBERSHIP_NUMBER: (number: string) => `/members/membership-number/${number}`,
  WITHOUT_WAIVER: "/members/without-waiver",
  NEW_SINCE: (date: string) => `/members/new-since/${date}`,
  COUNT_BY_STATUS: (status: string) => `/members/count/status/${status}`,
  HEALTH_INFO: (id: string) => `/members/${id}/health-info`,
  FITNESS_GOALS: (id: string) => `/members/${id}/fitness-goals`,
  EMERGENCY_CONTACT: (id: string) => `/members/${id}/emergency-contact`,
  ACTIVATE: (id: string) => `/members/${id}/activate`,
  SUSPEND: (id: string) => `/members/${id}/suspend`,
  CANCEL: (id: string) => `/members/${id}/cancel`,
  SIGN_WAIVER: (id: string) => `/members/${id}/sign-waiver`,
} as const;

export const MEMBERSHIPS = {
  BY_ID: (id: string) => `/memberships/${id}`,
  SUBSCRIBE: "/memberships/subscribe",
  BY_MEMBER: (memberId: string) => `/memberships/member/${memberId}`,
  ACTIVE_BY_MEMBER: (memberId: string) => `/memberships/member/${memberId}/active`,
  BY_GYM: (gymId: string) => `/memberships/gym/${gymId}`,
  EXPIRING: (gymId: string) => `/memberships/gym/${gymId}/expiring`,
  COUNT: (gymId: string) => `/memberships/gym/${gymId}/count`,
  FREEZE: (id: string) => `/memberships/${id}/freeze`,
  UNFREEZE: (id: string) => `/memberships/${id}/unfreeze`,
  RENEW: (id: string) => `/memberships/${id}/renew`,
  CANCEL: (id: string) => `/memberships/${id}/cancel`,
  USE_CREDIT: (id: string) => `/memberships/${id}/use-credit`,
} as const;

export const MEMBERSHIP_PLANS = {
  BASE: "/membership-plans",
  BY_ID: (id: string) => `/membership-plans/${id}`,
  BY_GYM: (gymId: string) => `/membership-plans/gym/${gymId}`,
  PRICING: (id: string) => `/membership-plans/${id}/pricing`,
  FEATURES: (id: string) => `/membership-plans/${id}/features`,
  FEATURED: (id: string) => `/membership-plans/${id}/featured`,
} as const;

export const CLASSES = {
  BASE: "/classes",
  BY_ID: (id: string) => `/classes/${id}`,
  BY_GYM: (gymId: string) => `/classes/gym/${gymId}`,
} as const;

export const CLASS_SCHEDULES = {
  BASE: "/class-schedules",
  BY_ID: (id: string) => `/class-schedules/${id}`,
  BY_GYM: (gymId: string) => `/class-schedules/gym/${gymId}`,
} as const;

export const CLASS_CATEGORIES = {
  BASE: "/class-categories",
  BY_ID: (id: string) => `/class-categories/${id}`,
  BY_GYM: (gymId: string) => `/class-categories/gym/${gymId}`,
} as const;

export const BOOKINGS = {
  BASE: "/bookings",
  BY_ID: (id: string) => `/bookings/${id}`,
  CHECK_IN: (id: string) => `/bookings/${id}/check-in`,
  CHECK_OUT: (id: string) => `/bookings/${id}/check-out`,
  CANCEL: (id: string) => `/bookings/${id}/cancel`,
  BY_SCHEDULE: (scheduleId: string) => `/bookings/schedule/${scheduleId}`,
  BY_MEMBER: (memberId: string) => `/bookings/member/${memberId}`,
} as const;

export const EQUIPMENT = {
  BASE: "/inventory/equipment",
  BY_ID: (id: string) => `/inventory/equipment/${id}`,
  STATUS: (id: string) => `/inventory/equipment/${id}/status`,
  MAINTENANCE: (id: string) => `/inventory/equipment/${id}/maintenance`,
  BY_ORGANISATION: "/inventory/equipment/organisation",
  BY_GYM: (gymId: string) => `/inventory/equipment/gym/${gymId}`,
  ACTIVE_BY_GYM: (gymId: string) => `/inventory/equipment/gym/${gymId}/active`,
  MAINTENANCE_DUE: (gymId: string) => `/inventory/equipment/gym/${gymId}/maintenance-due`,
} as const;

export const MAINTENANCE = {
  SCHEDULES: "/inventory/maintenance/schedules",
  SCHEDULE_BY_ID: (id: string) => `/inventory/maintenance/schedules/${id}`,
  RESCHEDULE: (id: string) => `/inventory/maintenance/schedules/${id}/reschedule`,
  COMPLETE_SCHEDULE: (id: string) => `/inventory/maintenance/schedules/${id}/complete`,
  PENDING_BY_GYM: (gymId: string) => `/inventory/maintenance/schedules/gym/${gymId}/pending`,
  DUE_BY_GYM: (gymId: string) => `/inventory/maintenance/schedules/gym/${gymId}/due`,
  RECORDS: "/inventory/maintenance/records",
  RECORD_BY_ID: (id: string) => `/inventory/maintenance/records/${id}`,
  COMPLETE_RECORD: (id: string) => `/inventory/maintenance/records/${id}/complete`,
  RECORDS_BY_GYM: (gymId: string) => `/inventory/maintenance/records/gym/${gymId}`,
  RECORDS_BY_EQUIPMENT: (equipmentId: string) => `/inventory/maintenance/records/equipment/${equipmentId}`,
} as const;

export const INVENTORY = {
  ITEMS: "/inventory/items",
  ITEM_BY_ID: (id: string) => `/inventory/items/${id}`,
  MOVEMENTS: (id: string) => `/inventory/items/${id}/movements`,
  PURCHASE: (id: string) => `/inventory/items/${id}/purchase`,
  SALE: (id: string) => `/inventory/items/${id}/sale`,
  DAMAGE: (id: string) => `/inventory/items/${id}/damage`,
  ADJUSTMENT: (id: string) => `/inventory/items/${id}/adjustment`,
  BY_GYM: (gymId: string) => `/inventory/items/gym/${gymId}`,
  LOW_STOCK: (gymId: string) => `/inventory/items/gym/${gymId}/low-stock`,
  REORDER_NEEDED: (gymId: string) => `/inventory/items/gym/${gymId}/reorder-needed`,
  MOVEMENTS_BY_GYM: (gymId: string) => `/inventory/items/movements/gym/${gymId}`,
} as const;

export const SUPPLIERS = {
  BASE: "/inventory/suppliers",
  BY_ID: (id: string) => `/inventory/suppliers/${id}`,
  RATING: (id: string) => `/inventory/suppliers/${id}/rating`,
  PREFERRED: (id: string) => `/inventory/suppliers/${id}/preferred`,
  ACTIVATE: (id: string) => `/inventory/suppliers/${id}/activate`,
  DEACTIVATE: (id: string) => `/inventory/suppliers/${id}/deactivate`,
} as const;

export const TRAINERS = {
  BASE: "/trainers",
  BY_ID: (id: string) => `/trainers/${id}`,
  RATE: (id: string) => `/trainers/${id}/rate`,
  BY_USER: (userId: string) => `/trainers/user/${userId}`,
  AVAILABLE: "/trainers/available",
  ACTIVATE: (id: string) => `/trainers/${id}/activate`,
  DEACTIVATE: (id: string) => `/trainers/${id}/deactivate`,
  TOGGLE_ACCEPTING: (id: string) => `/trainers/${id}/toggle-accepting`,
} as const;

export const STAFF = {
  BASE: "/staff",
  BY_ID: (id: string) => `/staff/${id}`,
  WAGE: (id: string) => `/staff/${id}/wage`,
  POSITION: (id: string) => `/staff/${id}/position`,
  BY_USER: (userId: string) => `/staff/user/${userId}`,
  BY_DEPARTMENT: (department: string) => `/staff/department/${department}`,
  ACTIVE: "/staff/active",
  ACTIVATE: (id: string) => `/staff/${id}/activate`,
  DEACTIVATE: (id: string) => `/staff/${id}/deactivate`,
} as const;

export const SUBSCRIPTIONS = {
  BASE: "/subscriptions",
  CURRENT: "/subscriptions/current",
  TIERS: "/subscriptions/tiers",
  FEATURED_TIERS: "/subscriptions/tiers/featured",
  UPGRADE: "/subscriptions/upgrade",
  DOWNGRADE: "/subscriptions/downgrade",
  CANCEL: "/subscriptions/cancel",
  REACTIVATE: "/subscriptions/reactivate",
  USAGE_CURRENT: "/subscriptions/usage/current",
  USAGE_HISTORY: "/subscriptions/usage/history",
  RATE_LIMIT_STATUS: "/subscriptions/rate-limit/status",
  RATE_LIMIT_STATISTICS: "/subscriptions/rate-limit/statistics",
  RATE_LIMIT_UNBLOCK: "/subscriptions/rate-limit/unblock",
} as const;

export const SUBSCRIPTION_PAYMENTS = {
  INVOICES: "/subscriptions/payments/invoices",
  METHODS: "/subscriptions/payments/methods",
  METHOD_BY_ID: (id: string) => `/subscriptions/payments/methods/${id}`,
  REFUNDS: "/subscriptions/payments/refunds",
  REFUND_BY_ID: (id: string) => `/subscriptions/payments/refunds/${id}`,
  REFUND_REQUESTS: "/subscriptions/payments/refund-requests",
  REFUND_REQUEST_BY_ID: (id: string) => `/subscriptions/payments/refund-requests/${id}`,
  REFUND_REQUEST_AUDIT: (id: string) => `/subscriptions/payments/refund-requests/${id}/audit`,
  PENDING_REFUND_REQUESTS: "/subscriptions/payments/refund-requests/pending",
  APPROVE_REFUND: (id: string) => `/subscriptions/payments/refund-requests/${id}/approve`,
  REJECT_REFUND: (id: string) => `/subscriptions/payments/refund-requests/${id}/reject`,
  CANCEL_REFUND: (id: string) => `/subscriptions/payments/refund-requests/${id}/cancel`,
  PROCESS_REFUND: (id: string) => `/subscriptions/payments/refund-requests/${id}/process`,
} as const;

export const MEMBER_PAYMENTS = {
  METHODS: (memberId: string) => `/memberships/payments/methods/${memberId}`,
  ATTACH_METHOD: "/memberships/payments/methods",
  INVOICES: (memberId: string) => `/memberships/payments/invoices/${memberId}`,
  CANCEL_SUBSCRIPTION: (membershipId: string) => `/memberships/payments/${membershipId}/cancel`,
} as const;

export const MEMBER_REFUNDS = {
  REQUEST: "/members/refunds/request",
  MY_REQUESTS: "/members/refunds/my-requests",
  MY_REQUEST_BY_ID: (id: string) => `/members/refunds/my-requests/${id}`,
  CANCEL_MY_REQUEST: (id: string) => `/members/refunds/my-requests/${id}/cancel`,
} as const;

export const GYM_REFUNDS = {
  ALL: "/gym/refund-requests",
  BY_ID: (id: string) => `/gym/refund-requests/${id}`,
  AUDIT: (id: string) => `/gym/refund-requests/${id}/audit`,
  PENDING: "/gym/refund-requests/pending",
  APPROVE: (id: string) => `/gym/refund-requests/${id}/approve`,
  REJECT: (id: string) => `/gym/refund-requests/${id}/reject`,
  ESCALATE: (id: string) => `/gym/refund-requests/${id}/escalate`,
  PROCESS: (id: string) => `/gym/refund-requests/${id}/process`,
} as const;

export const WORKOUTS = {
  BASE: "/workouts",
  BY_ID: (id: string) => `/workouts/${id}`,
  BY_MEMBER: (memberId: string) => `/workouts/member/${memberId}`,
  LATEST: (memberId: string) => `/workouts/member/${memberId}/latest`,
  PAGINATED: (memberId: string) => `/workouts/member/${memberId}/paginated`,
  RANGE: (memberId: string) => `/workouts/member/${memberId}/range`,
  STATISTICS: (memberId: string) => `/workouts/member/${memberId}/statistics`,
  STREAK: (memberId: string) => `/workouts/member/${memberId}/streak`,
} as const;

export const HEALTH_METRICS = {
  BASE: "/health-metrics",
  BMI: "/health-metrics/bmi",
  BY_ID: (id: string) => `/health-metrics/${id}`,
  ALL: "/health-metrics/all",
  LATEST: "/health-metrics/latest",
  HISTORY: "/health-metrics/history",
  HISTORY_RANGE: "/health-metrics/history/range",
  TREND: "/health-metrics/trend",
  BODY_COMPOSITION: "/health-metrics/body-composition",
} as const;

export const HEALTH_DASHBOARD = {
  MEMBER: (memberId: string) => `/health-dashboard/member/${memberId}`,
  HEALTH_INSIGHTS: (memberId: string) => `/health-dashboard/member/${memberId}/health-insights`,
  WORKOUT_INSIGHTS: (memberId: string) => `/health-dashboard/member/${memberId}/workout-insights`,
  METRIC_TRENDS: (memberId: string) => `/health-dashboard/member/${memberId}/metric-trends`,
} as const;

export const FITNESS_GOALS = {
  BASE: "/fitness-goals",
  BY_ID: (id: string) => `/fitness-goals/${id}`,
  PROGRESS: (id: string) => `/fitness-goals/${id}/progress`,
  PROGRESS_REPORT: (id: string) => `/fitness-goals/${id}/progress-report`,
  PAUSE: (id: string) => `/fitness-goals/${id}/pause`,
  RESUME: (id: string) => `/fitness-goals/${id}/resume`,
  ACHIEVE: (id: string) => `/fitness-goals/${id}/achieve`,
  ABANDON: (id: string) => `/fitness-goals/${id}/abandon`,
  BY_MEMBER: (memberId: string) => `/fitness-goals/member/${memberId}`,
  ACTIVE_BY_MEMBER: (memberId: string) => `/fitness-goals/member/${memberId}/active`,
  BY_STATUS: (memberId: string, status: string) => `/fitness-goals/member/${memberId}/status/${status}`,
  BY_TYPE: (memberId: string, type: string) => `/fitness-goals/member/${memberId}/type/${type}`,
  STATISTICS: (memberId: string) => `/fitness-goals/member/${memberId}/statistics`,
  OVERDUE: (gymId: string) => `/fitness-goals/gym/${gymId}/overdue`,
  UPCOMING_DEADLINES: (gymId: string) => `/fitness-goals/gym/${gymId}/upcoming-deadlines`,
} as const;

export const EXERCISES = {
  BASE: "/exercises",
  BY_ID: (id: string) => `/exercises/${id}`,
  PUBLIC: "/exercises/public",
  CUSTOM: "/exercises/custom",
  SEARCH: "/exercises/search",
  BY_CATEGORY: (categoryId: string) => `/exercises/by-category/${categoryId}`,
  BY_MUSCLE_GROUP: "/exercises/by-muscle-group",
  BY_DIFFICULTY: "/exercises/by-difficulty",
  CATEGORIES: "/exercises/categories",
  CATEGORY_BY_ID: (id: string) => `/exercises/categories/${id}`,
} as const;

export const GYM_AREAS = {
  BASE: "/gym-areas",
  BY_ID: (id: string) => `/gym-areas/${id}`,
  BY_GYM: (gymId: string) => `/gym-areas/gym/${gymId}`,
} as const;

export const STRIPE_CONNECT = {
  ONBOARD: "/connect/onboard",
  REFRESH: "/connect/refresh",
  STATUS: "/connect/status",
  DASHBOARD: "/connect/dashboard",
  CAN_ACCEPT_PAYMENTS: "/connect/can-accept-payments",
} as const;

export const USERS = {
  BASE: "/users",
  ME: "/users/me",
  BY_ID: (id: string) => `/users/${id}`,
  PROFILE: (id: string) => `/users/${id}/profile`,
  ACTIVATE: (id: string) => `/users/${id}/activate`,
  DEACTIVATE: (id: string) => `/users/${id}/deactivate`,
  GYM_ADMINS: "/users/gym-admins",
  BY_ROLE: (role: string) => `/users/by-role/${role}`,
} as const;

export const ANALYTICS = {
  DASHBOARD: (gymId: string) => `/analytics/dashboard/gym/${gymId}`,
  DASHBOARD_TODAY: (gymId: string) => `/analytics/dashboard/gym/${gymId}/today`,
  DASHBOARD_WEEKLY: (gymId: string) => `/analytics/dashboard/gym/${gymId}/weekly`,
  DASHBOARD_MONTHLY: (gymId: string) => `/analytics/dashboard/gym/${gymId}/monthly`,
  MEMBERS: (gymId: string) => `/analytics/members/gym/${gymId}`,
  REVENUE: (gymId: string) => `/analytics/revenue/gym/${gymId}`,
  CLASSES: (gymId: string) => `/analytics/classes/gym/${gymId}`,
  KPI_MEMBERS: (gymId: string) => `/analytics/kpi/members/gym/${gymId}`,
  KPI_REVENUE: (gymId: string) => `/analytics/kpi/revenue/gym/${gymId}`,
  KPI_CLASSES: (gymId: string) => `/analytics/kpi/classes/gym/${gymId}`,
} as const;

export const NOTIFICATIONS = {
  BASE: "/notifications",
  BY_ID: (id: string) => `/notifications/${id}`,
  UNREAD: "/notifications/unread",
  UNREAD_COUNT: "/notifications/unread-count",
  MARK_READ: (id: string) => `/notifications/${id}/read`,
  MARK_ALL_READ: "/notifications/mark-all-read",
  BY_GYM: (gymId: string) => `/notifications/gym/${gymId}`,
  GYM_UNREAD: (gymId: string) => `/notifications/gym/${gymId}/unread`,
  GYM_UNREAD_COUNT: (gymId: string) => `/notifications/gym/${gymId}/unread-count`,
  GYM_MARK_ALL_READ: (gymId: string) => `/notifications/gym/${gymId}/mark-all-read`,
  STREAM: "/notifications/stream",
  STREAM_STATS: "/notifications/stream/stats",
} as const;

export const NEWSLETTERS = {
  CAMPAIGNS: "/newsletters/campaigns",
  CAMPAIGN_BY_ID: (id: string) => `/newsletters/campaigns/${id}`,
  CAMPAIGN_PREVIEW: (id: string) => `/newsletters/campaigns/${id}/preview`,
  CAMPAIGN_SCHEDULE: (id: string) => `/newsletters/campaigns/${id}/schedule`,
  CAMPAIGN_SEND: (id: string) => `/newsletters/campaigns/${id}/send`,
  CAMPAIGN_CANCEL: (id: string) => `/newsletters/campaigns/${id}/cancel`,
  TEMPLATES: "/newsletters/templates",
  TEMPLATE_BY_ID: (id: string) => `/newsletters/templates/${id}`,
} as const;

export const POS = {
  SALES: "/pos/sales",
  QUICK_SALE: "/pos/sales/quick",
  SALE_BY_ID: (saleId: string) => `/pos/sales/${saleId}`,
  COMPLETE_SALE: (saleId: string) => `/pos/sales/${saleId}/complete`,
  CANCEL_SALE: (saleId: string) => `/pos/sales/${saleId}/cancel`,
  REFUND_SALE: (saleId: string) => `/pos/sales/${saleId}/refund`,
  ADD_SALE_ITEM: (saleId: string) => `/pos/sales/${saleId}/items`,
  REMOVE_SALE_ITEM: (saleId: string, itemId: string) => `/pos/sales/${saleId}/items/${itemId}`,
  SALES_BY_GYM: (gymId: string) => `/pos/sales/gym/${gymId}`,
  SALES_TODAY: (gymId: string) => `/pos/sales/gym/${gymId}/today`,
  SALES_DATE_RANGE: (gymId: string) => `/pos/sales/gym/${gymId}/daterange`,
  SALES_BY_MEMBER: (memberId: string) => `/pos/sales/member/${memberId}`,
  DRAWER_OPEN: "/pos/drawer/open",
  DRAWER_CLOSE: (drawerId: string) => `/pos/drawer/${drawerId}/close`,
  DRAWER_CURRENT: (gymId: string) => `/pos/drawer/gym/${gymId}/current`,
  DRAWER_HISTORY: (gymId: string) => `/pos/drawer/gym/${gymId}/history`,
  REPORT_SUMMARY: (gymId: string) => `/pos/reports/gym/${gymId}/summary`,
  REPORT_TOP_ITEMS: (gymId: string) => `/pos/reports/gym/${gymId}/top-items`,
} as const;

export const LEADS = {
  BASE: "/leads",
  BY_ID: (id: string) => `/leads/${id}`,
  BY_GYM: (gymId: string) => `/leads/gym/${gymId}`,
  BY_GYM_AND_STATUS: (gymId: string, status: string) => `/leads/gym/${gymId}/status/${status}`,
  ORGANISATION: "/leads/organisation",
  STATUS: (id: string) => `/leads/${id}/status`,
  CONVERT: (id: string) => `/leads/${id}/convert`,
} as const;

export const INVITES = {
  BASE: (gymId: string) => `/gyms/${gymId}/invites`,
  BY_ID: (gymId: string, inviteId: string) => `/gyms/${gymId}/invites/${inviteId}`,
  RESEND: (gymId: string, inviteId: string) => `/gyms/${gymId}/invites/${inviteId}/resend`,
} as const;

export const WEBHOOKS = {
  STRIPE_PLATFORM: "/webhooks/stripe/platform",
  STRIPE_CONNECT: "/webhooks/stripe/connect",
} as const;
