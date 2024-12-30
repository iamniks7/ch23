import { SizeUnit } from '../types';

interface SizeLimits {
  min: number;
  max: number;
}

export const FILE_SIZE_LIMITS: Record<SizeUnit, SizeLimits> = {
  'B': { min: 5024, max: 5024000 },
  'KB': { min: 5, max: 5024 },
  'MB': { min: 1, max: 5 }
};

export const DPI_LIMITS = {
  min: 72,
  max: 300
};

export function validateFileSize(size: number | '', unit: SizeUnit): boolean {
  if (size === '') return true;
  const limits = FILE_SIZE_LIMITS[unit];
  return size >= limits.min && size <= limits.max;
}

export function validateDPI(dpi: number | ''): boolean {
  if (dpi === '') return true;
  return dpi >= DPI_LIMITS.min && dpi <= DPI_LIMITS.max;
}