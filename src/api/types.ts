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

export interface UpdateProfileRequest {
  name?: string
  email?: string
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

// ==================== Owner Types ====================

export interface Owner {
  id: number
  name: string
  tailbar?: string
  createdAt: string
  updatedAt: string
}

// ==================== Uulder (Breed) Types ====================

export interface Uulder {
  id: number
  name: string
  description?: string
  ownerId?: number
  aduuToo?: number
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

// ==================== Buleg (Group/Lineage) Types ====================

export interface Buleg {
  id: number
  name: string
  tailbar?: string
  ownerId?: number
  aduuToo?: number
  createdAt: string
  updatedAt: string
}

export interface CreateBulegRequest {
  name: string
  tailbar?: string
}

export interface UpdateBulegRequest {
  name?: string
  tailbar?: string
}

// ==================== Zurag (Photo) Types ====================

export interface Zurag {
  id: number
  url: string
  tailbar?: string
  aduuId: number
  createdAt: string
  updatedAt: string
}

export interface AddZuragRequest {
  url: string
  tailbar?: string
}

export interface UpdateZuragRequest {
  tailbar?: string
}

// ==================== Aduu (Horse) Types ====================

export type Huis = 'er' | 'em'

export type ZarlagaShaltgaan = 'uhsen' | 'belgelsen' | 'zarsan' | 'alga_bolson' | 'hulgailagdsan'

export const zarlagaShaltgaanLabels: Record<ZarlagaShaltgaan, string> = {
  uhsen: 'Үхсэн',
  belgelsen: 'Бэлэглэсэн',
  zarsan: 'Зарсан',
  alga_bolson: 'Алга болсон',
  hulgailagdsan: 'Хулгайлагдсан',
}

export interface Aduu {
  id: number
  ner: string
  huis: Huis
  tursunOn?: number
  zarlagaOn?: number
  zarlagaShaltgaan?: ZarlagaShaltgaan
  tursunGazar?: string
  zus?: string
  microchip?: string
  dnaCode?: string
  tamga?: string
  uraldsan: boolean
  tailbar?: string
  ooriinBish?: boolean
  ezniiNer?: string
  zupisnuud?: Zurag[]
  uulderId?: number
  uulder?: Uulder
  bulegId?: number
  buleg?: Buleg
  fatherId?: number
  father?: Aduu
  motherId?: number
  mother?: Aduu
  ownerId: number
  owner?: Owner
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
  bulegId?: number
  uraldsan?: boolean
  zarlagaShaltgaan?: ZarlagaShaltgaan
  tursunOnMin?: number
  tursunOnMax?: number
}

export interface CreateAduuRequest {
  ner: string
  huis: Huis
  tursunOn?: number
  zarlagaOn?: number
  zarlagaShaltgaan?: ZarlagaShaltgaan
  tursunGazar?: string
  zus?: string
  microchip?: string
  dnaCode?: string
  tamga?: string
  uraldsan?: boolean
  tailbar?: string
  ooriinBish?: boolean
  ezniiNer?: string
  uulderId?: number
  bulegId?: number
  fatherId?: number
  motherId?: number
}

export interface UpdateAduuRequest {
  ner?: string
  huis?: Huis
  tursunOn?: number
  zarlagaOn?: number | null
  zarlagaShaltgaan?: ZarlagaShaltgaan | null
  tursunGazar?: string
  zus?: string
  microchip?: string
  dnaCode?: string
  tamga?: string
  uraldsan?: boolean
  tailbar?: string
  ooriinBish?: boolean
  ezniiNer?: string | null
  uulderId?: number
  bulegId?: number
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
  tursunOn?: number
  zus?: string
  uulder?: { id: number; name: string }
  father?: AncestorNode
  mother?: AncestorNode
}

export interface DescendantNode {
  id: number
  ner: string
  huis: Huis
  tursunOn?: number
  zus?: string
  uulder?: { id: number; name: string }
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

// ==================== Stats Types ====================

export interface NasAngilal {
  nasZereg: string
  erToo: number
  emToo: number
  niit: number
}

export interface BulegAngilal {
  bulegId: number | null
  bulegNer: string
  erToo: number
  emToo: number
  niit: number
}

export interface UulderAngilal {
  uulderId: number | null
  uulderNer: string
  erToo: number
  emToo: number
  niit: number
}

export interface TopAmjilttaiAduu {
  id: number
  ner: string
  huis: Huis
  tursunOn?: number
  zus?: string
  amjiltToo: number
}

export interface SuulchiiNemegsed {
  id: number
  ner: string
  huis: Huis
  tursunOn?: number
  zus?: string
  uulder?: { id: number; name: string }
  createdAt: string
}

export interface StatsResponse {
  niitToo: {
    aduu: number
    uulder: number
    buleg: number
    er: number
    em: number
    uraldsan: number
    zarlagaToo: number
  }
  odoogiinOn: number
  nasaarAngilal: NasAngilal[]
  bulegaarAngilal: BulegAngilal[]
  uulderaarAngilal: UulderAngilal[]
  topAmjilttaiAduu: TopAmjilttaiAduu[]
  suulchiiNemegsed: SuulchiiNemegsed[]
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
