import { PlusCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import PrimaryButton from '../../components/buttons/PrimaryButton';
import ConfirmDialog from '../../components/feedback/ConfirmDialog';
import Loader from '../../components/feedback/Loader';
import SelectInput from '../../components/inputs/SelectInput';
import PageHeader from '../../components/layout/PageHeader';
import PageWrapper from '../../components/layout/PageWrapper';
import { fetchClasses } from '../../redux/actions/classActions';
import { fetchSectionsByClass } from '../../redux/actions/sectionActions';
import { fetchSubjects } from '../../redux/actions/subjectActions';
import {
  createSyllabusItem,
  deleteSyllabusItem,
  fetchSyllabus,
  reorderSyllabus,
  toggleSyllabusStatus,
  updateSyllabusItem,
} from '../../redux/actions/syllabusActions';
import { calculateProgress, buildOptions } from '../../utils/helpers';
import SyllabusItemForm from './components/SyllabusItemForm';
import SyllabusList from './components/SyllabusList';

const Syllabus = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user?.role);
  const classes = useSelector((state) => state.classes.list);
  const sections = useSelector((state) => state.sections.list);
  const subjects = useSelector((state) => state.subjects.list);
  const items = useSelector((state) => state.syllabus.items);
  const loading = useSelector((state) => state.syllabus.loading);
  const [filters, setFilters] = useState({ classId: '', sectionId: '', subjectId: '' });
  const [modal, setModal] = useState({ open: false, item: null });
  const [deleteItem, setDeleteItem] = useState(null);

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  useEffect(() => {
    if (filters.classId) dispatch(fetchSectionsByClass(filters.classId));
  }, [dispatch, filters.classId]);

  useEffect(() => {
    dispatch(fetchSubjects({ classId: filters.classId, sectionId: filters.sectionId }));
  }, [dispatch, filters.classId, filters.sectionId]);

  useEffect(() => {
    if (filters.subjectId) dispatch(fetchSyllabus(filters.subjectId));
  }, [dispatch, filters.subjectId]);

  const progress = useMemo(() => calculateProgress(items), [items]);
  const readOnly = role === 'student';

  return (
    <PageWrapper>
      <PageHeader
        title="Syllabus"
        description="Follow chapter progress per subject and keep section-level learning plans visible."
        actions={!readOnly ? <PrimaryButton type="button" onClick={() => setModal({ open: true, item: null })}><span className="inline-flex items-center gap-2"><PlusCircle className="h-4 w-4" /> Add Item</span></PrimaryButton> : null}
      />

      <div className="glass-panel grid gap-4 p-6 lg:grid-cols-3">
        <SelectInput value={filters.classId} onChange={(event) => setFilters({ classId: event.target.value, sectionId: '', subjectId: '' })} options={buildOptions(classes)} placeholder="Choose class" />
        <SelectInput value={filters.sectionId} onChange={(event) => setFilters((current) => ({ ...current, sectionId: event.target.value, subjectId: '' }))} options={buildOptions(sections)} placeholder="Choose section" />
        <SelectInput value={filters.subjectId} onChange={(event) => setFilters((current) => ({ ...current, subjectId: event.target.value }))} options={buildOptions(subjects)} placeholder="Choose subject" />
      </div>

      <section className="glass-panel p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-on-surface">Progress</h2>
            <p className="mt-1 text-sm text-on-surface-variant">{progress}% completed</p>
          </div>
          <div className="h-3 w-full max-w-sm overflow-hidden rounded-full bg-surface-container">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </section>

      {loading ? <Loader label="Loading syllabus..." /> : null}
      {!loading ? (
        <SyllabusList
          items={items}
          readOnly={readOnly}
          onEdit={(item) => setModal({ open: true, item })}
          onDelete={(item) => setDeleteItem(item)}
          onToggle={(item) => dispatch(toggleSyllabusStatus(item._id))}
          onMove={(item, index, direction) => {
            const next = [...items];
            const swapIndex = direction === 'up' ? index - 1 : index + 1;
            if (swapIndex < 0 || swapIndex >= items.length) return;
            [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
            dispatch(reorderSyllabus({ subjectId: filters.subjectId, items: next.map((entry, order) => ({ id: entry._id, order })) }));
          }}
        />
      ) : null}

      <SyllabusItemForm
        isOpen={modal.open}
        defaultValues={modal.item}
        onClose={() => setModal({ open: false, item: null })}
        onSubmit={async (values) => {
          const action = modal.item
            ? updateSyllabusItem({ id: modal.item._id, ...values })
            : createSyllabusItem({ ...values, subjectId: filters.subjectId });
          const result = await dispatch(action);
          if (!result.error) setModal({ open: false, item: null });
        }}
        loading={loading}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteItem)}
        title="Delete Syllabus Item"
        message="This syllabus item will be removed from the checklist."
        confirmText="Delete"
        onCancel={() => setDeleteItem(null)}
        onConfirm={async () => {
          const result = await dispatch(deleteSyllabusItem(deleteItem._id));
          if (!result.error) setDeleteItem(null);
        }}
        loading={loading}
      />
    </PageWrapper>
  );
};

export default Syllabus;
