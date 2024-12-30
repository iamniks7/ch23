import { Dimensions } from '../types';

export function calculateFitDimensions(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number
): Dimensions {
  // Calculate scaling factors
  const scale = Math.min(
    targetWidth / sourceWidth,
    targetHeight / sourceHeight
  );

  // Calculate new dimensions while maintaining aspect ratio
  return {
    width: Math.round(sourceWidth * scale),
    height: Math.round(sourceHeight * scale)
  };
}

export function calculateFillDimensions(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number
): Dimensions {
  const scale = Math.max(
    targetWidth / sourceWidth,
    targetHeight / sourceHeight
  );
  return {
    width: Math.round(sourceWidth * scale),
    height: Math.round(sourceHeight * scale)
  };
}