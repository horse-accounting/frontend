import type { Zurag } from '../api'

// Хамгийн сүүлд оруулсан зургийн URL (хамгийн өндөр id = хамгийн шинэ).
// Backend zuragnuud-ийн дарааллыг баталгаажуулдаггүй тул id-гээр сонгоно.
export function getNewestZuragUrl(zuragnuud?: Zurag[]): string | undefined {
  if (!zuragnuud || zuragnuud.length === 0) return undefined
  return zuragnuud.reduce((newest, z) => (z.id > newest.id ? z : newest)).url
}
