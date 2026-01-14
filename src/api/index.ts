// API Client
export { apiClient, setAuthToken, clearAuthToken, getAuthToken } from './client'

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
  useMe,
  useChangePassword,
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

// Aduu (Horse)
export {
  aduuKeys,
  useAduunuud,
  useAduu,
  useFamilyTree,
  useCreateAduu,
  useUpdateAduu,
  useDeleteAduu,
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

// Upload
export {
  useUploadImage,
  useUploadImages,
  useDeleteImage,
  useDeleteImages,
} from './upload'
