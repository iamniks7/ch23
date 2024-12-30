import React from 'react';
import { Lock, Unlock, HelpCircle } from 'lucide-react';
import { Unit, SizeUnit, ImageFormat } from '../types';
import { presets, dimensionLimits, cn } from '../lib/utils';
import { UnitSelector } from './UnitSelector';
import { AdjustModeSelector } from './AdjustModeSelector';
import { Tooltip } from './Tooltip';
import { validateDimension, formatDimension } from '../lib/dimensionUtils';
import { useAspectRatio } from '../hooks/useAspectRatio';
import { validateFileSize, validateDPI, FILE_SIZE_LIMITS, DPI_LIMITS } from '../lib/validation';
import { usePresetSelection } from '../hooks/usePresetSelection';

export function ResizeControls({
  selectedUnit,
  width,
  height,
  maintainAspectRatio,
  dpi,
  targetSize,
  sizeUnit,
  format,
  // selectedPreset,
  adjustMode,
  onUnitChange,
  onWidthChange,
  onHeightChange,
  onToggleAspectRatio,
  onDpiChange,
  onTargetSizeChange,
  onSizeUnitChange,
  onFormatChange,
  onPresetChange,
  onAdjustModeChange,
  images,
}: Props) {
  
  const {
    handleDimensionChange,
    canMaintainAspectRatio,
  } = useAspectRatio({
    images,
    maintainAspectRatio,
    width,
    height,
    onWidthChange,
    onHeightChange,
  });

  const isWidthValid = validateDimension(width, selectedUnit);
  const isHeightValid = validateDimension(height, selectedUnit);

  // Check if dimensions should be disabled
  const isDimensionsDisabled = adjustMode === 'none';

  const {
    lastPreset,
    handlePresetChange,
    handleDimensionChange: handlePresetDimensionChange
  } = usePresetSelection(width, height, onPresetChange);


  const handleLocalDimensionChange = (value: string, dimension: 'width' | 'height') => {
    handlePresetDimensionChange(value, dimension);
    handleDimensionChange(value, dimension);
  };


  const isTargetSizeValid = validateFileSize(targetSize, sizeUnit);
  const isDPIValid = validateDPI(dpi);
  
  // Disable additional settings for PNG and HEIC
  const disableAdditionalSettings = format === 'PNG' || format === 'HEIC';

  // Effect to clear dimensions when 'none' is selected
  React.useEffect(() => {
    if (adjustMode === 'none') {
      onWidthChange('');
      onHeightChange('');
    }
  }, [adjustMode]);

  return (
    <div>
      <div className="space-y-6 bg-white p-3 sm:p-4 rounded-xl border bg-zinc-100">
        <div className="space-y-5">
          <div>
            <label className="block text-md font-semibold text-gray-700 mb-2">
              Dimension Unit
            </label>
            <UnitSelector value={selectedUnit} onChange={onUnitChange} />
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 order-2">
              <label className="block text-md font-semibold text-gray-700 mb-2">
                Presets for {selectedUnit.toUpperCase()} dimensions
              </label>
              {/* <select
                value={selectedPreset}
                onChange={(e) => onPresetChange(e.target.value)}
                disabled={isDimensionsDisabled}
                className={cn(
                  "block w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-blue-500",
                  isDimensionsDisabled && "bg-gray-100 cursor-not-allowed opacity-60"
                )}
              >
                <option value="custom">Custom Size</option>
                {presets[selectedUnit].map((preset) => (
                  <option key={preset.name} value={preset.name}>
                    {preset.name} ({preset.width}x{preset.height} {selectedUnit})
                  </option>
                ))}
              </select> */}

              <select
                value={lastPreset}
                onChange={(e) => handlePresetChange(e.target.value)}
                disabled={isDimensionsDisabled}
                className={cn(
                  "block w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-blue-500",
                  isDimensionsDisabled && "bg-gray-100 cursor-not-allowed opacity-60"
                )}
              >
                <option value="custom">Custom Size</option>
                {presets[selectedUnit].map((preset) => (
                  <option key={preset.name} value={preset.name}>
                    {preset.name} ({preset.width}x{preset.height} {selectedUnit})
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-1/2 order-1">
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-md font-semibold text-gray-700">
                  Adjust image
                </label>
                <Tooltip content="Choose how the image should fit within the dimensions">
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </Tooltip>
              </div>
              <AdjustModeSelector value={adjustMode} onChange={onAdjustModeChange} />
            </div>
          </div>
        
          <div className="grid grid-cols-5 gap-4 items-start">
            <div className="col-span-2">
              <label className="block text-md font-semibold text-gray-700 mb-2">
                Width
              </label>
              <div className="space-y-1">
                <div className="relative">
                    {/* <input
                      type="number"
                      step="any"
                      value={formatDimension(width)}
                      onChange={(e) => handleDimensionChange(e.target.value, 'width')}
                      placeholder={adjustMode === 'none' ? "same as original" : "-"}
                      disabled={adjustMode === 'none'}
                      className={cn(
                        "block w-full h-12 px-4 rounded-xl border focus:ring-blue-500",
                        !isWidthValid 
                          ? "border-red-300 focus:border-red-500 text-red-900" 
                          : "border-gray-300 focus:border-blue-500",
                        isDimensionsDisabled && "bg-gray-100 cursor-not-allowed opacity-60"
                      )}
                    /> */}

                    <input
                      type="number"
                      step="any"
                      value={formatDimension(width)}
                      onChange={(e) => handleLocalDimensionChange(e.target.value, 'width')}
                      placeholder={adjustMode === 'none' ? "same as original" : "-"}
                      disabled={adjustMode === 'none'}
                      className={cn(
                        "block w-full h-12 px-4 rounded-xl border focus:ring-blue-500",
                        !isWidthValid 
                          ? "border-red-300 focus:border-red-500 text-red-900" 
                          : "border-gray-300 focus:border-blue-500",
                        isDimensionsDisabled && "bg-gray-100 cursor-not-allowed opacity-60"
                      )}
                    />
                    
                    
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    {selectedUnit}
                  </span>
                </div>
                {!isWidthValid && !isDimensionsDisabled && (
                  <p className="text-sm text-red-600">
                    Maximum width for {selectedUnit} is {dimensionLimits[selectedUnit]}
                  </p>
                )}

                </div>
            </div>

            <div className="flex items-center justify-center pt-8">
              <Tooltip 
                content={
                  !canMaintainAspectRatio
                    ? "This lock feature is only available for single image"
                    : "Lock aspect ratio"
                  }
              >
                <button
                  onClick={onToggleAspectRatio}
                  className={`p-2 rounded-lg ${!canMaintainAspectRatio || isDimensionsDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                  disabled={!canMaintainAspectRatio || isDimensionsDisabled}
                >
                  {maintainAspectRatio ? (
                    <Lock className="h-5 w-5 text-green-600" />
                  ) : (
                    <Unlock className="h-5 w-5 text-red-400" />
                  )}
                </button>
              </Tooltip>
            </div>

            <div className="col-span-2">
              <label className="block text-md font-semibold text-gray-700 mb-2">
                Height
              </label>
                <div className="space-y-1">
                <div className="relative">
                  
                  <input
                    type="number"
                    step="any"
                    value={formatDimension(height)}
                    onChange={(e) => handleLocalDimensionChange(e.target.value, 'height')}
                    placeholder={adjustMode === 'none' ? "same as original" : "-"}
                    disabled={isDimensionsDisabled}
                    className={cn(
                      "block w-full h-12 px-4 rounded-xl border focus:ring-blue-500",
                      !isHeightValid 
                        ? "border-red-300 focus:border-red-500 text-red-900" 
                        : "border-gray-300 focus:border-blue-500",
                      isDimensionsDisabled && "bg-gray-100 cursor-not-allowed opacity-60"
                    )}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    {selectedUnit}
                  </span>
                </div>
                {!isHeightValid && (
                  <p className="text-sm text-red-600">
                    Maximum height for {selectedUnit} is {dimensionLimits[selectedUnit]}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-md font-semibold text-gray-700 mb-2">
              Save image as
            </label>
            <select
              value={format}
              onChange={(e) => onFormatChange(e.target.value as ImageFormat)}
              className="block w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="original">Original</option>
              <option value="JPG">JPG</option>
              <option value="JPEG">JPEG</option>
              <option value="PNG">PNG</option>
              <option value="WEBP">WEBP</option>
              <option value="HEIC">HEIC</option>
            </select>
          </div>
        </div>
      </div>
      <div className="space-y-6 mt-4 bg-white p-3 sm:p-4 rounded-xl border bg-zinc-100">
        {/* <p className="text-md text-gray-400 font-semibold">Additional Settings (optional) {disableAdditionalSettings && "(Not available for PNG/HEIC)"}</p> */}

        <p className="text-md text-gray-400 font-semibold">
        {disableAdditionalSettings && "*Not available for PNG/HEIC" || "Additional Settings (optional)" }
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 gap-y-4">
          <div>
            <label className="block text-base font-medium text-gray-700 mb-2">
              Target File Size
            </label>
            <div className="relative">
              <input
                type="text"
                pattern="[0-9]*"
                value={targetSize || ''}
                onChange={(e) => onTargetSizeChange(Number(e.target.value))}
                placeholder="Not set"
                disabled={disableAdditionalSettings}
                className={cn(
                  "block w-full h-12 px-4 rounded-xl border focus:ring-blue-500",
                  !isTargetSizeValid 
                    ? "border-red-300 focus:border-red-500 text-red-900" 
                    : "border-gray-300 focus:border-blue-500",
                  disableAdditionalSettings && "bg-gray-100 cursor-not-allowed opacity-60"
                )}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                {sizeUnit}
              </span>
            </div>
            {!isTargetSizeValid && (
            <p className="text-sm text-red-600 mt-1">
              {`Size must be between ${FILE_SIZE_LIMITS[sizeUnit].min} and ${FILE_SIZE_LIMITS[sizeUnit].max} ${sizeUnit}`}
            </p>
            )}
          </div>

          <div>
            <label className="block text-md font-semibold text-gray-700 mb-2">
              Size Unit
            </label>
            <select
              value={sizeUnit}
              onChange={(e) => onSizeUnitChange(e.target.value as SizeUnit)}
              disabled={disableAdditionalSettings}
              className={cn(
                "block w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-blue-500",
                disableAdditionalSettings && "bg-gray-100 cursor-not-allowed opacity-60"
              )}
            >
              <option value="B">Bytes</option>
              <option value="KB">KB</option>
              <option value="MB">MB</option>
            </select>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="block text-base font-medium text-gray-700">
                DPI
              </label>
              <Tooltip content="Dots Per Inch - affects print quality">
                <HelpCircle className="h-4 w-4 text-gray-400" />
              </Tooltip>
            </div>
            <input
            type="text"
            pattern="[0-9]*"
            value={dpi || ''}
            onChange={(e) => onDpiChange(Number(e.target.value))}
            placeholder="Default set to 300"
            disabled={disableAdditionalSettings}
            className={cn(
              "block w-full h-12 px-4 rounded-xl border focus:ring-blue-500",
              !isDPIValid 
                ? "border-red-300 focus:border-red-500 text-red-900" 
                : "border-gray-300 focus:border-blue-500",
              disableAdditionalSettings && "bg-gray-100 cursor-not-allowed opacity-60"
            )}
          />
          {!isDPIValid && (
            <p className="text-sm text-red-600 mt-1">
              DPI must be between {DPI_LIMITS.min} and {DPI_LIMITS.max}
            </p>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}