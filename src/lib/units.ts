import { Unit, SizeUnit } from '../types';

export function convertToPixels(value: number, unit: Unit, dpi: number = 96): number {
  switch (unit) {
    case 'cm':
      return Math.round((value * dpi) / 2.54);
    case 'mm':
      return Math.round((value * dpi) / 25.4);
    case 'inch':
      return Math.round(value * dpi);
    case '%':
      return value; // Percentage is handled separately
    default:
      return value; // px
  }
}

export function convertToBytes(size: number, unit: SizeUnit): number {
  switch (unit) {
    case 'KB':
      return size * 1024;
    case 'MB':
      return size * 1024 * 1024;
    case 'B':
    default:
      return size;
  }
}

export function calculatePercentageDimensions(
  originalWidth: number,
  originalHeight: number,
  widthPercent: number,
  heightPercent: number
): { width: number; height: number } {
  return {
    width: Math.round(originalWidth * (1 + widthPercent / 100)),
    height: Math.round(originalHeight * (1 + heightPercent / 100))
  };
}