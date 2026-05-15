import { Pencil, Trash2, UserCog } from 'lucide-react';

const SectionList = ({ sections = [], onEdit, onDelete, onReassign, canManage = false }) => (
  <div className="space-y-3">
    {sections.map((section) => (
      <div key={section._id} className="flex flex-col gap-4 rounded-glass-sm bg-white/50 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-semibold text-on-surface">{section.name}</p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Teacher: {section.classTeacherId?.name || 'Unassigned'} · Room: {section.roomNumber || '—'} · Students: {section.studentCount || 0}
          </p>
        </div>
        {canManage ? (
          <div className="flex gap-2">
            <button type="button" onClick={() => onEdit(section)} className="rounded-full bg-white p-2 text-secondary"><Pencil className="h-4 w-4" /></button>
            <button type="button" onClick={() => onReassign(section)} className="rounded-full bg-white p-2 text-primary"><UserCog className="h-4 w-4" /></button>
            <button type="button" onClick={() => onDelete(section)} className="rounded-full bg-white p-2 text-error"><Trash2 className="h-4 w-4" /></button>
          </div>
        ) : null}
      </div>
    ))}
  </div>
);

export default SectionList;
