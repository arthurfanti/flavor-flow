import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function normalizeImageUrl(url: string | undefined | null): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return url;
  return `/${url}`;
}

export function normalizeSourceUrl(url: string | undefined | null): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  try {
    const parsed = new URL(trimmed);
    const host = parsed.host.toLowerCase();
    const path = parsed.pathname.replace(/\/+$/, '');
    const base = `${parsed.protocol}//${host}${path}`;
    return `${base}${parsed.search}${parsed.hash}`;
  } catch {
    return trimmed.replace(/\/+$/, '');
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStorageUrl(path: string | undefined | null): string {
  if (!path) return '';
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return '';
  return `${supabaseUrl}/storage/v1/object/public/recipe_thumbnails/${path}`;
}
