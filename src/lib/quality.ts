/**
 * Calculates the optimal quality setting to achieve a target file size
 * Uses binary search to find the closest quality value
 */
export function calculateQualityForTargetSize(
  canvas: HTMLCanvasElement,
  format: string,
  targetBytes: number,
  tolerance: number = 0.1
): number {
  let min = 0.1;
  let max = 1.0;
  let quality = 0.7; // Start with a reasonable quality
  let tries = 0;
  const maxTries = 10;

  while (tries < maxTries) {
    const blob = canvas.toDataURL(format, quality);
    // Approximate blob size from base64 string
    const size = Math.ceil((blob.length - 22) * 3 / 4);

    const diff = Math.abs(size - targetBytes) / targetBytes;
    if (diff <= tolerance) {
      break;
    }

    if (size > targetBytes) {
      max = quality;
    } else {
      min = quality;
    }

    quality = (min + max) / 2;
    tries++;
  }

  return quality;
}


// UPDATE CODE BELOW:
// Update the quality calculation function
// export function calculateQualityForTargetSize(
//   canvas: HTMLCanvasElement,
//   format: string,
//   targetBytes: number,
//   tolerance: number = 0.1
// ): number {
//   let min = 0.1;
//   let max = 1.0;
//   let quality = 0.7; // Start with a reasonable quality
//   let tries = 0;
//   const maxTries = 10;

//   while (tries < maxTries) {
//     const blob = canvas.toDataURL(format, quality);
//     // Approximate blob size from base64 string
//     const size = Math.ceil((blob.length - 22) * 3 / 4);

//     const diff = Math.abs(size - targetBytes) / targetBytes;
//     if (diff <= tolerance) {
//       break;
//     }

//     if (size > targetBytes) {
//       max = quality;
//     } else {
//       min = quality;
//     }

//     quality = (min + max) / 2;
//     tries++;
//   }

//   return quality;
// }