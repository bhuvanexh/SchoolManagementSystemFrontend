import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ to, label = 'Back' }) => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => (to ? navigate(to) : navigate(-1))}
      className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-on-surface-variant transition hover:bg-white hover:text-on-surface"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      {label}
    </button>
  );
};

export default BackButton;
