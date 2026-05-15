import Modal from '../modal/Modal';
import PrimaryButton from '../buttons/PrimaryButton';
import SecondaryButton from '../buttons/SecondaryButton';

const ConfirmDialog = ({
  isOpen,
  title = 'Confirm action',
  message = 'Are you sure you want to continue?',
  confirmText = 'Confirm',
  onConfirm,
  onCancel,
  loading = false,
}) => (
  <Modal
    isOpen={isOpen}
    title={title}
    onClose={onCancel}
    footer={
      <>
        <SecondaryButton type="button" onClick={onCancel}>
          Cancel
        </SecondaryButton>
        <PrimaryButton type="button" onClick={onConfirm} disabled={loading}>
          {loading ? 'Working...' : confirmText}
        </PrimaryButton>
      </>
    }
  >
    <p className="text-sm leading-7 text-on-surface-variant">{message}</p>
  </Modal>
);

export default ConfirmDialog;
