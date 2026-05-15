import PrimaryButton from '../buttons/PrimaryButton';

const EmptyState = ({
  title = 'Nothing to show yet',
  message = 'Once data is available, it will appear here.',
  actionLabel,
  onAction,
}) => (
  <div className="glass-panel flex min-h-[220px] flex-col items-center justify-center gap-4 px-6 py-10 text-center">
    <div className="max-w-md space-y-2">
      <h3 className="text-xl font-bold text-on-surface">{title}</h3>
      <p className="text-sm text-on-surface-variant">{message}</p>
    </div>
    {actionLabel && onAction ? <PrimaryButton onClick={onAction}>{actionLabel}</PrimaryButton> : null}
  </div>
);

export default EmptyState;
