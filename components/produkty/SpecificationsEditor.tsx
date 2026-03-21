'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';
import type { ProductSpecification } from '@/types/product';

interface SpecificationsEditorProps {
  value: ProductSpecification[];
  onChange: (specs: ProductSpecification[]) => void;
}

export function SpecificationsEditor({ value, onChange }: SpecificationsEditorProps) {
  const isEnabled = value.length > 0;

  const handleToggle = (checked: boolean) => {
    if (checked) {
      onChange([{ key: '', value: '' }]);
    } else {
      onChange([]);
    }
  };

  const handleChange = (index: number, field: 'key' | 'value', newValue: string) => {
    const updated = value.map((spec, i) =>
      i === index ? { ...spec, [field]: newValue } : spec
    );
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...value, { key: '', value: '' }]);
  };

  const handleRemove = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    if (updated.length === 0) {
      onChange([]);
    } else {
      onChange(updated);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id="has-specifications"
          checked={isEnabled}
          onCheckedChange={handleToggle}
        />
        <Label htmlFor="has-specifications" className="cursor-pointer font-medium">
          Parametry techniczne
        </Label>
      </div>

      {isEnabled && (
        <div className="space-y-2 pl-6">
          <div className="grid grid-cols-[1fr_1fr_auto] gap-2 text-sm text-muted-foreground px-1">
            <span>Parametr</span>
            <span>Wartość</span>
            <span />
          </div>
          {value.map((spec, index) => (
            <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
              <Input
                placeholder="np. Moc"
                value={spec.key}
                onChange={(e) => handleChange(index, 'key', e.target.value)}
              />
              <Input
                placeholder="np. 2000 W"
                value={spec.value}
                onChange={(e) => handleChange(index, 'value', e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(index)}
                className="h-9 w-9 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAdd}
            className="mt-1"
          >
            <Plus className="h-4 w-4 mr-1" />
            Dodaj parametr
          </Button>
        </div>
      )}
    </div>
  );
}
