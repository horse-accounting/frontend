// ==================== Common Types ====================

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: Pagination
}

export interface AduunuudResponse {
  aduunuud: Aduu[]
  pagination: Pagination
}

// ==================== User Types ====================

export type UserRole = 'user' | 'admin'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  isActive: boolean
  isEmailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  accessToken: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface RegisterResponse {
  user: User
  accessToken: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

// ==================== Users Admin Types ====================

export interface UsersQueryParams {
  page?: number
  limit?: number
  search?: string
  role?: UserRole
  isActive?: boolean
}

export interface CreateUserRequest {
  name: string
  email: string
  password: string
  role?: UserRole
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  password?: string
  role?: UserRole
  isActive?: boolean
}

export interface ChangeRoleRequest {
  role: UserRole
}

// ==================== Uulder (Breed) Types ====================

export interface Uulder {
  id: number
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface CreateUulderRequest {
  name: string
  description?: string
}

export interface UpdateUulderRequest {
  name?: string
  description?: string
}

// ==================== Aduu (Horse) Types ====================

export type Huis = 'azarga' | 'guu' | 'mori'

export interface Aduu {
  id: number
  ner: string
  huis: Huis
  tursunOn?: number
  nasBarsan?: number
  tursunGazar?: string
  zus?: string
  microchip?: string
  dnaCode?: string
  tamga?: string
  uraldsan: boolean
  tailbar?: string
  zurag: string[]
  uulderId?: number
  uulder?: Uulder
  fatherId?: number
  father?: Aduu
  motherId?: number
  mother?: Aduu
  ownerId: number
  owner?: User
  amjiltuud?: Amjilt[]
  createdAt: string
  updatedAt: string
}

export interface AduuQueryParams {
  page?: number
  limit?: number
  search?: string
  huis?: Huis
  uulderId?: number
  uraldsan?: boolean
  tursunOnMin?: number
  tursunOnMax?: number
}

export interface CreateAduuRequest {
  ner: string
  huis: Huis
  tursunOn?: number
  nasBarsan?: number
  tursunGazar?: string
  zus?: string
  microchip?: string
  dnaCode?: string
  tamga?: string
  uraldsan?: boolean
  tailbar?: string
  zurag?: string[]
  uulderId?: number
  fatherId?: number
  motherId?: number
}

export interface UpdateAduuRequest {
  ner?: string
  huis?: Huis
  tursunOn?: number
  nasBarsan?: number
  tursunGazar?: string
  zus?: string
  microchip?: string
  dnaCode?: string
  tamga?: string
  uraldsan?: boolean
  tailbar?: string
  zurag?: string[]
  uulderId?: number
  fatherId?: number
  motherId?: number
}

export interface FamilyTreeParams {
  ancestorDepth?: number
  descendantDepth?: number
}

export interface AncestorNode {
  id: number
  ner: string
  huis: Huis
  father?: AncestorNode
  mother?: AncestorNode
}

export interface DescendantNode {
  id: number
  ner: string
  huis: Huis
  children?: DescendantNode[]
}

export interface FamilyTreeResponse {
  aduu: Aduu
  ancestors: {
    father?: AncestorNode
    mother?: AncestorNode
  }
  descendants: DescendantNode[]
}

// ==================== Amjilt (Achievement) Types ====================

export interface Amjilt {
  id: number
  aduuId: number
  aduu?: Aduu
  temtseen: string
  ezelsenBair: string
  uraldsanOgnoo?: string
  unaach?: string
  gazarBairshil?: string
  tailbar?: string
  createdAt: string
  updatedAt: string
}

export interface CreateAmjiltRequest {
  aduuId: number
  temtseen: string
  ezelsenBair: string
  uraldsanOgnoo?: string
  unaach?: string
  gazarBairshil?: string
  tailbar?: string
}

export interface UpdateAmjiltRequest {
  temtseen?: string
  ezelsenBair?: string
  uraldsanOgnoo?: string
  unaach?: string
  gazarBairshil?: string
  tailbar?: string
}

// ==================== Upload Types ====================

export type UploadFolder = 'horses' | 'users' | 'other'

export interface UploadedImage {
  url: string
  thumbnailUrl: string
  publicId: string
  width: number
  height: number
  format: string
  size: number
}

export interface UploadImageResponse {
  url: string
  thumbnailUrl: string
  publicId: string
  width: number
  height: number
  format: string
  size: number
}

export interface UploadImagesResponse {
  images: UploadedImage[]
  urls: string[]
}

export interface DeleteImagesRequest {
  publicIds: string[]
}

export interface DeleteImagesResponse {
  deleted: Record<string, string>
}
