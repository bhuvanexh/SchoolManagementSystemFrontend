import { Pencil, PlusCircle, UserCog2, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import PrimaryButton from '../../components/buttons/PrimaryButton';
import DataTable from '../../components/data-display/DataTable';
import ConfirmDialog from '../../components/feedback/ConfirmDialog';
import EmptyState from '../../components/feedback/EmptyState';
import Loader from '../../components/feedback/Loader';
import SelectInput from '../../components/inputs/SelectInput';
import PageHeader from '../../components/layout/PageHeader';
import PageWrapper from '../../components/layout/PageWrapper';
import { fetchClasses } from '../../redux/actions/classActions';
import { fetchSectionsByClass } from '../../redux/actions/sectionActions';
import { deleteSubject, fetchSubjects } from '../../redux/actions/subjectActions';
import { buildOptions } from '../../utils/helpers';

const Subjects = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading } = useSelector((state) => state.subjects);
  const classes = useSelector((state) => state.classes.list);
  const sections = useSelector((state) => state.sections.list);
  const [filters, setFilters] = useState({ classId: '', sectionId: '' });
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchSubjects(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    if (filters.classId) dispatch(fetchSectionsByClass(filters.classId));
  }, [dispatch, filters.classId]);

  const columns = useMemo(
    () => [
      { header: 'Subject Name', accessorKey: 'name' },
      { header: 'Core Subject', cell: ({ row }) => row.original.coreSubject?.name || '—' },
      { header: 'Section', cell: ({ row }) => row.original.section?.name || '—' },
      { header: 'Subject Teacher', cell: ({ row }) => row.original.subjectTeacher?.name || '—' },
      { header: 'Periods/Week', accessorKey: 'periodsPerWeek' },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button type="button" onClick={() => navigate(`/subjects/${row.original._id}/edit`)} className="rounded-full bg-white p-2 text-secondary"><Pencil className="h-4 w-4" /></button>
            <button type="button" onClick={() => navigate(`/subjects/${row.original._id}/edit`)} className="rounded-full bg-white p-2 text-primary"><UserCog2 className="h-4 w-4" /></button>
            <button type="button" onClick={() => setDeleteId(row.original._id)} className="rounded-full bg-white p-2 text-error"><Trash2 className="h-4 w-4" /></button>
          </div>
        ),
      },
    ],
    [navigate]
  );

  return (
    <PageWrapper>
      <PageHeader
        title="Subjects"
        description="Manage per-section subject records, teacher assignments, and weekly periods."
        actions={<Link to="/subjects/new"><PrimaryButton><span className="inline-flex items-center gap-2"><PlusCircle className="h-4 w-4" /> Add Subject</span></PrimaryButton></Link>}
      />

      <div className="glass-panel grid gap-4 p-6 md:grid-cols-2">
        <SelectInput value={filters.classId} onChange={(event) => setFilters((current) => ({ ...current, classId: event.target.value, sectionId: '' }))} options={buildOptions(classes)} placeholder="Filter by class" />
        <SelectInput value={filters.sectionId} onChange={(event) => setFilters((current) => ({ ...current, sectionId: event.target.value }))} options={buildOptions(sections)} placeholder="Filter by section" />
      </div>

      {loading ? <Loader label="Loading subjects..." /> : null}
      {!loading && !list.length ? <EmptyState title="No subjects found" message="Create a subject to map teachers and academic planning to sections." /> : null}
      {!loading && list.length ? <DataTable columns={columns} data={list} /> : null}

      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Subject"
        message="The subject and its linked workflow will be removed from active use. Continue?"
        confirmText="Delete"
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          const result = await dispatch(deleteSubject(deleteId));
          if (!result.error) setDeleteId(null);
        }}
        loading={loading}
      />
    </PageWrapper>
  );
};

export default Subjects;
