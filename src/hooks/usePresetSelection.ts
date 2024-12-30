import { useState, useEffect } from 'react';

export function usePresetSelection(
  width: number | '', 
  height: number | '',
  onPresetChange: (preset: string) => void
) {
  const [lastPreset, setLastPreset] = useState('custom');
  const [manualEdit, setManualEdit] = useState(false);

  useEffect(() => {
    if (manualEdit) {
      onPresetChange('custom');
      setManualEdit(false);
    }
  }, [manualEdit, onPresetChange]);

  const handlePresetChange = (preset: string) => {
    setLastPreset(preset);
    onPresetChange(preset);
  };

  const handleDimensionChange = (value: string, dimension: 'width' | 'height') => {
    if (lastPreset !== 'custom') {
      setManualEdit(true);
    }
  };

  return {
    lastPreset,
    handlePresetChange,
    handleDimensionChange
  };
}