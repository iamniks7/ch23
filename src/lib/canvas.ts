interface CanvasSetup {
  width: number;
  height: number;
  x: number;
  y: number;
}

export function setupCanvas(
  finalWidth: number,
  finalHeight: number,
  targetWidth: number,
  targetHeight: number,
  mode: 'fit' | 'fill' | 'stretch' | 'none'
): CanvasSetup {
  let canvasWidth: number;
  let canvasHeight: number;
  let x: number;
  let y: number;

  switch (mode) {
    case 'fit':
      // For fit mode, use target dimensions for canvas
      canvasWidth = targetWidth;
      canvasHeight = targetHeight;
      // Center the image in the canvas
      x = Math.round((targetWidth - finalWidth) / 2);
      y = Math.round((targetHeight - finalHeight) / 2);
      break;
    
    default:
      canvasWidth = finalWidth;
      canvasHeight = finalHeight;
      x = 0;
      y = 0;
  }

  return {
    width: canvasWidth,
    height: canvasHeight,
    x,
    y
  };
}