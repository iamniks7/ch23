import { ImageFormat, SizeUnit, Unit } from '../types';
import { calculateFitDimensions, calculateFillDimensions } from './scaling';
import { setupCanvas } from './canvas';
import { convertToPixels, convertToBytes } from './units';
import { calculateQualityForTargetSize } from './quality';

interface ResizeOptions {
  width: number;
  height: number;
  unit: Unit;
  mode: 'none' | 'fill' | 'fit' | 'stretch';
  format: ImageFormat;
  dpi?: number;
  targetSize?: {
    size: number;
    unit: SizeUnit;
  };
}

export async function processImage(file: File, options: ResizeOptions): Promise<{ 
  data: Blob; 
  info: { width: number; height: number; size: number; }
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let finalWidth: number;
      let finalHeight: number;
      let targetWidth: number;
      let targetHeight: number; 
      
      if (options.mode === 'none') {
        // Use original dimensions for 'none' mode
        finalWidth = img.width;
        finalHeight = img.height;
        targetWidth = img.width;
        targetHeight = img.height;
        
      } else {
        // Convert input dimensions to pixels for other modes
        targetWidth = convertToPixels(options.width, options.unit, options.dpi);
        targetHeight = convertToPixels(options.height, options.unit, options.dpi);

        // Calculate final dimensions based on mode
        switch (options.mode) {
          case 'fit':
            const fitDims = calculateFitDimensions(img.width, img.height, targetWidth, targetHeight);
            finalWidth = fitDims.width;
            finalHeight = fitDims.height;
            break;
          case 'fill':
            const fillDims = calculateFillDimensions(img.width, img.height, targetWidth, targetHeight);
            finalWidth = fillDims.width;
            finalHeight = fillDims.height;
            break;
          case 'stretch':
            finalWidth = targetWidth;
            finalHeight = targetHeight;
            break;
        }
      }

      // Setup canvas
      const canvasSetup = setupCanvas(finalWidth, finalHeight, targetWidth, targetHeight, options.mode);
      canvas.width = canvasSetup.width;
      canvas.height = canvasSetup.height;

      if (ctx) {
        // Set DPI if specified
        const dpi = options.dpi || 96;
        ctx.scale(dpi / 96, dpi / 96);

        // Fill with white background for JPG
        if (options.format.toLowerCase() === 'jpg' || options.format.toLowerCase() === 'jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Draw the image
        ctx.drawImage(img, canvasSetup.x, canvasSetup.y, finalWidth, finalHeight);

        // Determine output format
        const format = options.format === 'original' 
          ? file.type 
          : `image/${options.format.toLowerCase()}`;
        
        let quality = 0.92;
        
        // Handle target file size if specified and format supports quality
        if (options.targetSize && !['image/png', 'image/heic'].includes(format)) {
          const targetBytes = convertToBytes(options.targetSize.size, options.targetSize.unit);
          quality = calculateQualityForTargetSize(canvas, format, targetBytes);
        }

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({
                data: blob,
                info: {
                  width: canvas.width,
                  height: canvas.height,
                  size: blob.size
                }
              });
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          format,
          quality
        );
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
}