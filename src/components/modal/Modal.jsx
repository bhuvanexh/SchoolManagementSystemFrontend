import { X } from 'lucide-react';

const Modal = ({ isOpen, title, children, footer, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="glass-panel w-full max-w-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold text-on-surface">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-on-surface-variant transition hover:bg-white/70"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6">{children}</div>
        {footer ? <div className="mt-6 flex justify-end gap-3">{footer}</div> : null}
      </div>
    </div>
  );
};

export default Modal;
