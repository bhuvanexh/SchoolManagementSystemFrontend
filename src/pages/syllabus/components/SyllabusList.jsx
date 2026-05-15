import { ArrowDown, ArrowUp, CheckCircle2, Circle, Pencil, Trash2 } from 'lucide-react';

import Badge from '../../../components/data-display/Badge';

const SyllabusList = ({ items = [], readOnly = false, onEdit, onDelete, onToggle, onMove }) => (
  <div className="space-y-3">
    {items.map((item, index) => {
      const isCompleted = item.status === 'completed';
      const isFirst = index === 0;
      const isLast = index === items.length - 1;

      return (
        <div
          key={item._id}
          className={`rounded-glass-sm p-4 transition-all ${isCompleted ? 'bg-white/30 opacity-75' : 'bg-white/50'}`}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`font-semibold ${isCompleted ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                  {item.topic}
                </span>
                <Badge tone={isCompleted ? 'success' : 'neutral'}>{isCompleted ? 'Completed' : 'Pending'}</Badge>
              </div>
              <p className="mt-1.5 text-sm text-on-surface-variant">{item.estimatedPeriods} {item.estimatedPeriods === 1 ? 'period' : 'periods'}</p>
              {item.description ? (
                <p className="mt-2 text-sm leading-6 text-on-surface-variant">{item.description}</p>
              ) : null}
            </div>

            {!readOnly ? (
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
                  onClick={() => onToggle(item)}
                  className={`rounded-full p-2 transition-colors ${isCompleted ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-white text-on-surface-variant hover:text-primary'}`}
                >
                  {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  title="Move up"
                  onClick={() => onMove(item, index, 'up')}
                  disabled={isFirst}
                  className="rounded-full bg-white p-2 text-tertiary disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Move down"
                  onClick={() => onMove(item, index, 'down')}
                  disabled={isLast}
                  className="rounded-full bg-white p-2 text-tertiary disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Edit"
                  onClick={() => onEdit(item)}
                  className="rounded-full bg-white p-2 text-secondary"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Delete"
                  onClick={() => onDelete(item)}
                  className="rounded-full bg-white p-2 text-error"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      );
    })}
  </div>
);

export default SyllabusList;
