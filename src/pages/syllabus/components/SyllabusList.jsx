import { ArrowDown, ArrowUp, CheckCircle2, Pencil, Trash2 } from 'lucide-react';

import Badge from '../../../components/data-display/Badge';

const SyllabusList = ({ items = [], readOnly = false, onEdit, onDelete, onToggle, onMove }) => (
  <div className="space-y-3">
    {items.map((item, index) => (
      <div key={item._id} className="rounded-glass-sm bg-white/50 p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-semibold text-on-surface">{item.topic}</p>
              <Badge tone={item.status === 'completed' ? 'success' : 'neutral'}>{item.status || 'pending'}</Badge>
            </div>
            <p className="mt-2 text-sm text-on-surface-variant">{item.estimatedPeriods} periods</p>
            {item.description ? <p className="mt-2 text-sm leading-7 text-on-surface-variant">{item.description}</p> : null}
          </div>
          {!readOnly ? (
            <div className="flex gap-2">
              <button type="button" onClick={() => onToggle(item)} className="rounded-full bg-white p-2 text-primary"><CheckCircle2 className="h-4 w-4" /></button>
              <button type="button" onClick={() => onMove(item, index, 'up')} className="rounded-full bg-white p-2 text-tertiary"><ArrowUp className="h-4 w-4" /></button>
              <button type="button" onClick={() => onMove(item, index, 'down')} className="rounded-full bg-white p-2 text-tertiary"><ArrowDown className="h-4 w-4" /></button>
              <button type="button" onClick={() => onEdit(item)} className="rounded-full bg-white p-2 text-secondary"><Pencil className="h-4 w-4" /></button>
              <button type="button" onClick={() => onDelete(item)} className="rounded-full bg-white p-2 text-error"><Trash2 className="h-4 w-4" /></button>
            </div>
          ) : null}
        </div>
      </div>
    ))}
  </div>
);

export default SyllabusList;
