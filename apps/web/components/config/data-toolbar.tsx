'use client';

import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ToolbarProps {
  title: string;
  description?: string;
  addLabel: string;
  onAdd: () => void;
  loading?: boolean;
  canAdd?: boolean;
}

export function DataToolbar({ title, description, addLabel, onAdd, loading, canAdd = true }: ToolbarProps) {
  return (
    <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="flex items-center gap-2">
        {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        {canAdd && (
          <Button onClick={onAdd} size="sm" className="bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white">
            <Plus className="mr-1 h-4 w-4" />
            {addLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
