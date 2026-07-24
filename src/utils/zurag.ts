import type { Zurag } from '../api'

// Хамгийн сүүлд оруулсан зургийн URL (хамгийн өндөр id = хамгийн шинэ).
// Backend zuragnuud-ийн дарааллыг баталгаажуулдаггүй тул id-гээр сонгоно.
export function getNewestZuragUrl(zuragnuud?: Zurag[]): string | undefined {
  if (!zuragnuud || zuragnuud.length === 0) return undefined
  return zuragnuud.reduce((newest, z) => (z.id > newest.id ? z : newest)).url
}

// Cloudinary URL-д хэмжээ багасгах transform залгаж жижиг thumbnail болгоно.
// Зургууд 1280px-ээр хадгалагддаг тул 28-56px нүдэнд бүтнээр татах нь үрэлгэн —
// CDN дээр багасгаснаар татах хэмжээ эрс буурна. Cloudinary биш URL-г хэвээр буцаана.
// `size` = харагдах CSS пиксел. Retina дэлгэцэнд тод байлгахын тулд ×2-оор татна
// (dpr_auto нь browser client-hints шаарддаг тул найдваргүй — тод байлгахаар шууд 2x авна).
export function cloudinaryThumb(url: string | undefined, size = 64): string | undefined {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url
  const px = Math.round(size * 2)
  return url.replace('/upload/', `/upload/w_${px},h_${px},c_fill,f_auto,q_auto/`)
}
