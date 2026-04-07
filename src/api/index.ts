// API Client
export { apiClient } from './client'

// Types
export * from './types'

// Auth
export {
  authKeys,
  useLogin,
  useRegister,
  useLogout,
  useForgotPassword,
  useResetPassword,
  useSendVerificationCode,
  useVerifyEmail,
  useVerifyResetCode,
  useMe,
  useChangePassword,
  useUpdateProfile,
} from './auth'

// Users (Admin)
export {
  usersKeys,
  useUsers,
  useUser,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useToggleUserActive,
  useChangeUserRole,
} from './users'

// Uulder (Breed)
export {
  uulderKeys,
  useUulders,
  useUulder,
  useCreateUulder,
  useUpdateUulder,
  useDeleteUulder,
} from './uulder'

// Buleg (Group/Lineage)
export {
  bulegKeys,
  useBulegs,
  useBuleg,
  useCreateBuleg,
  useUpdateBuleg,
  useDeleteBuleg,
} from './buleg'

// Aduu (Horse)
export {
  aduuKeys,
  useAduunuud,
  useAduu,
  useFamilyTree,
  useCreateAduu,
  useUpdateAduu,
  useDeleteAduu,
  useDownloadAduuPdf,
  useExportAduuExcel,
} from './aduu'

// Amjilt (Achievement)
export {
  amjiltKeys,
  useAmjiltuudByAduu,
  useAmjilt,
  useCreateAmjilt,
  useUpdateAmjilt,
  useDeleteAmjilt,
} from './amjilt'

// Zurag (Photo)
export {
  zuragKeys,
  useZuragnuud,
  useAddZurag,
  useUpdateZurag,
  useDeleteZurag,
} from './zurag'

// Stats (Dashboard)
export {
  statsKeys,
  useStats,
} from './stats'

// Upload
export {
  useUploadImage,
  useUploadImages,
  useDeleteImage,
  useDeleteImages,
} from './upload'
