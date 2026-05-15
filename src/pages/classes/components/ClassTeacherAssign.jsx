import { useState } from 'react';

import PrimaryButton from '../../../components/buttons/PrimaryButton';
import SecondaryButton from '../../../components/buttons/SecondaryButton';
import Modal from '../../../components/modal/Modal';

const ClassTeacherAssign = ({ isOpen, teachers = [], onClose, onSubmit, loading }) => {
  const [teacherId, setTeacherId] = useState('');

  return (
    <Modal
      isOpen={isOpen}
      title="Reassign Class Teacher"
      onClose={onClose}
      footer={
        <>
          <SecondaryButton type="button" onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton type="button" onClick={() => onSubmit(teacherId)} disabled={!teacherId || loading}>{loading ? 'Saving...' : 'Assign'}</PrimaryButton>
        </>
      }
    >
      <select className="input-field" value={teacherId} onChange={(event) => setTeacherId(event.target.value)}>
        <option value="">Select teacher</option>
        {teachers.map((teacher) => <option key={teacher.value} value={teacher.value}>{teacher.label}</option>)}
      </select>
    </Modal>
  );
};

export default ClassTeacherAssign;
