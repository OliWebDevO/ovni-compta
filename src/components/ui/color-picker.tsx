'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  className?: string;
}

const PRESET_COLORS = [
  '#FF6B6B', '#FF8E72', '#FFA94D', '#FFD43B',
  '#A9E34B', '#69DB7C', '#38D9A9', '#3BC9DB',
  '#4DABF7', '#748FFC', '#9775FA', '#DA77F2',
  '#F783AC', '#E8590C', '#D6336C', '#845EF7',
];

export function ColorPicker({ value, onChange, label, className }: ColorPickerProps) {
  const [hexInput, setHexInput] = useState(value);
  const nativeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHexInput(value);
  }, [value]);

  const handleHexChange = useCallback(
    (input: string) => {
      setHexInput(input);
      // Valider le format hex
      if (/^#[0-9A-Fa-f]{6}$/.test(input)) {
        onChange(input);
      }
    },
    [onChange]
  );

  const handleNativeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const color = e.target.value;
      setHexInput(color);
      onChange(color);
    },
    [onChange]
  );

  const handlePresetClick = useCallback(
    (color: string) => {
      setHexInput(color);
      onChange(color);
    },
    [onChange]
  );

  return (
    <div className={cn('grid gap-3', className)}>
      {label && <Label>{label}</Label>}

      {/* Aperçu + input natif (roue de couleur) */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => nativeInputRef.current?.click()}
          className="relative h-10 w-10 rounded-lg border-2 border-border shadow-sm cursor-pointer transition-transform hover:scale-105 active:scale-95"
          style={{ backgroundColor: value }}
          aria-label="Ouvrir la roue de couleur"
        >
          <input
            ref={nativeInputRef}
            type="color"
            value={value}
            onChange={handleNativeChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
            tabIndex={-1}
          />
        </button>

        {/* Saisie hex */}
        <div className="flex-1">
          <Input
            value={hexInput}
            onChange={(e) => handleHexChange(e.target.value)}
            placeholder="#FF6B6B"
            maxLength={7}
            className="font-mono text-sm"
          />
        </div>
      </div>

      {/* Présets */}
      <div className="grid grid-cols-8 gap-1.5">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => handlePresetClick(color)}
            className={cn(
              'h-7 w-full rounded-md border-2 transition-all hover:scale-110 active:scale-95',
              value === color
                ? 'border-foreground shadow-sm scale-110'
                : 'border-transparent hover:border-border'
            )}
            style={{ backgroundColor: color }}
            aria-label={`Couleur ${color}`}
          />
        ))}
      </div>
    </div>
  );
}
