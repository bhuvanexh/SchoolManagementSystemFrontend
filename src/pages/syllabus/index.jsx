import { PlusCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import PrimaryButton from '../../components/buttons/PrimaryButton';
import ConfirmDialog from '../../components/feedback/ConfirmDialog';
import EmptyState from '../../components/feedback/EmptyState';
import Loader from '../../components/feedback/Loader';
import SelectInput from '../../components/inputs/SelectInput';
import PageHeader from '../../components/layout/PageHeader';
import PageWrapper from '../../components/layout/PageWrapper';
import useFilterParams from '../../hooks/useFilterParams';
import usePermission from '../../hooks/usePermission';
import { fetchClasses } from '../../redux/actions/classActions';
import { fetchSectionsByClass } from '../../redux/actions/sectionActions';
import { clearSections } from '../../redux/slices/sectionSlice';
import { fetchSubjects } from '../../redux/actions/subjectActions';
import {
  createSyllabusItem,
  deleteSyllabusItem,
  fetchSyllabus,
  reorderSyllabus,
  toggleSyllabusStatus,
  updateSyllabusItem,
} from '../../redux/actions/syllabusActions';
import { clearItems } from '../../redux/slices/syllabusSlice';
import { calculateProgress, buildOptions } from '../../utils/helpers';
import SyllabusItemForm from './components/SyllabusItemForm';
import SyllabusList from './components/SyllabusList';

const Syllabus = () => {
  const dispatch = useDispatch();
  const [params, setParams] = useFilterParams();
  const role = useSelector((state) => state.auth.user?.role);
  const classes = useSelector((state) => state.classes.list);
  const sections = useSelector((state) => state.sections.list);
  const subjects = useSelector((state) => state.subjects.list);
  const items = useSelector((state) => state.syllabus.items);
  const loading = useSelector((state) => state.syllabus.loading);
  const { isAdmin, isSubjectTeacherOf } = usePermission();
  const [modal, setModal] = useState({ open: false, item: null });
  const [deleteItem, setDeleteItem] = useState(null);

  const selectedClass = useMemo(
    () => (params.classId ? classes.find((c) => c._id === params.classId) ?? null : null),
    [classes, params.classId]
  );
  const classHasSections = selectedClass?.hasSections === true;

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(clearItems());
  }, [dispatch]);

  useEffect(() => () => { dispatch(clearItems()); }, [dispatch]);

  useEffect(() => {
    if (params.classId && classHasSections) {
      dispatch(fetchSectionsByClass(params.classId));
    }
  }, [dispatch, params.classId, classHasSections]);

  useEffect(() => {
    if (classHasSections && params.sectionId) {
      dispatch(fetchSubjects({ sectionId: params.sectionId }));
    } else if (!classHasSections && params.classId) {
      dispatch(fetchSubjects({ classId: params.classId }));
    }
  }, [dispatch, classHasSections, params.classId, params.sectionId]);

  useEffect(() => {
    if (params.subjectId) {
      dispatch(fetchSyllabus(params.subjectId));
    } else {
      dispatch(clearItems());
    }
  }, [dispatch, params.subjectId]);

  const progress = useMemo(() => calculateProgress(items), [items]);
  const readOnly = role === 'student' || (role === 'teacher' && !isAdmin && !isSubjectTeacherOf(params.subjectId));

  const filterCols = classHasSections ? 'lg:grid-cols-3' : 'lg:grid-cols-2';

  return (
    <PageWrapper>
      <PageHeader
        title="Syllabus"
        description="Follow chapter progress per subject and keep section-level learning plans visible."
        actions={!readOnly && params.subjectId ? (
          <PrimaryButton type="button" onClick={() => setModal({ open: true, item: null })}>
            <span className="inline-flex items-center gap-2"><PlusCircle className="h-4 w-4" /> Add Item</span>
          </PrimaryButton>
        ) : null}
      />

      <div className={`glass-panel grid gap-4 p-6 ${filterCols}`}>
        <SelectInput
          label="Class"
          value={params.classId}
          onChange={(value) => {
            dispatch(clearSections());
            setParams({ classId: value, sectionId: '', subjectId: '' });
          }}
          options={buildOptions(classes)}
          placeholder="Choose class"
        />
        {classHasSections ? (
          <SelectInput
            label="Section"
            value={params.sectionId}
            onChange={(value) => setParams({ sectionId: value, subjectId: '' })}
            options={buildOptions(sections)}
            placeholder="Choose section"
            disabled={!params.classId}
          />
        ) : null}
        <SelectInput
          label="Subject"
          value={params.subjectId}
          onChange={(value) => setParams({ subjectId: value })}
          options={buildOptions(subjects)}
          placeholder="Choose subject"
          disabled={classHasSections ? !params.sectionId : !params.classId}
        />
      </div>

      {params.subjectId ? (
        <section className="glass-panel p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-on-surface">Progress</h2>
              <p className="mt-1 text-sm text-on-surface-variant">{progress}% completed</p>
            </div>
            <div className="h-3 w-full max-w-sm overflow-hidden rounded-full bg-surface-container">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </section>
      ) : null}

      {loading && !items.length ? <Loader label="Loading syllabus..." /> : null}

      {!params.subjectId ? (
        <EmptyState title="No subject selected" message="Choose a class and subject above to view the syllabus." />
      ) : !loading && !items.length ? (
        <EmptyState title="No syllabus items" message={readOnly ? 'No topics have been added yet.' : 'Add the first topic using the button above.'} />
      ) : (
        <SyllabusList
          items={items}
          readOnly={readOnly}
          onEdit={(item) => setModal({ open: true, item })}
          onDelete={(item) => setDeleteItem(item)}
          onToggle={(item) => dispatch(toggleSyllabusStatus(item._id))}
          onMove={(item, index, direction) => {
            const next = [...items];
            const swapIndex = direction === 'up' ? index - 1 : index + 1;
            if (swapIndex < 0 || swapIndex >= next.length) return;
            [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
            dispatch(reorderSyllabus({
              subjectId: params.subjectId,
              items: next.map((entry, order) => ({ id: entry._id, order })),
            }));
          }}
        />
      )}

      <SyllabusItemForm
        key={modal.open ? (modal.item?._id || 'new') : 'closed'}
        isOpen={modal.open}
        defaultValues={modal.item}
        onClose={() => setModal({ open: false, item: null })}
        onSubmit={async (values) => {
          const action = modal.item
            ? updateSyllabusItem({ id: modal.item._id, ...values })
            : createSyllabusItem({ ...values, subjectId: params.subjectId });
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
