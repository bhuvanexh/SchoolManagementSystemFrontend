import { Pencil, PenLine, PlusCircle, Send, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import PrimaryButton from '../../components/buttons/PrimaryButton';
import Badge from '../../components/data-display/Badge';
import DataTable from '../../components/data-display/DataTable';
import ConfirmDialog from '../../components/feedback/ConfirmDialog';
import EmptyState from '../../components/feedback/EmptyState';
import Loader from '../../components/feedback/Loader';
import SelectInput from '../../components/inputs/SelectInput';
import PageHeader from '../../components/layout/PageHeader';
import PageWrapper from '../../components/layout/PageWrapper';
import usePermission from '../../hooks/usePermission';
import { fetchSubjects } from '../../redux/actions/subjectActions';
import { deleteTest, fetchTests, publishTest } from '../../redux/actions/testActions';
import { buildOptions } from '../../utils/helpers';
import { formatDate } from '../../utils/formatters';

const Tests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.user?.role);
  const subjects = useSelector((state) => state.subjects.list);
  const sections = useSelector((state) => state.sections.list);
  const list = useSelector((state) => state.tests.list);
  const loading = useSelector((state) => state.tests.loading);
  const { isAdmin, isSubjectTeacherOf } = usePermission();
  const [filters, setFilters] = useState({ subjectId: '', sectionId: '' });
  const [confirm, setConfirm] = useState({ type: null, id: null });

  useEffect(() => {
    dispatch(fetchSubjects({}));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchTests(filters));
  }, [dispatch, filters]);

  const columns = useMemo(
    () => [
      { header: 'Test Name', accessorKey: 'name' },
      { header: 'Subject', cell: ({ row }) => row.original.subject?.name || '—' },
      { header: 'Section', cell: ({ row }) => row.original.section?.name || '—' },
      { header: 'Date', cell: ({ row }) => formatDate(row.original.date || row.original.testDate) },
      { header: 'Max Score', accessorKey: 'maxScore' },
      { header: 'Published', cell: ({ row }) => <Badge tone={row.original.isPublished ? 'success' : 'neutral'}>{row.original.isPublished ? 'Yes' : 'No'}</Badge> },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            {role !== 'student' && (isAdmin || isSubjectTeacherOf(row.original.subject?._id || row.original.subjectId)) ? <button type="button" onClick={() => navigate(`/tests/${row.original._id}`)} className="rounded-full bg-white p-2 text-secondary"><Pencil className="h-4 w-4" /></button> : null}
            {role !== 'student' && (isAdmin || isSubjectTeacherOf(row.original.subject?._id || row.original.subjectId)) ? <button type="button" onClick={() => navigate(`/tests/${row.original._id}/grade`)} className="rounded-full bg-white p-2 text-primary"><PenLine className="h-4 w-4" /></button> : null}
            {role !== 'student' && !row.original.isPublished && (isAdmin || isSubjectTeacherOf(row.original.subject?._id || row.original.subjectId)) ? <button type="button" onClick={() => setConfirm({ type: 'publish', id: row.original._id })} className="rounded-full bg-white p-2 text-tertiary"><Send className="h-4 w-4" /></button> : null}
            {role !== 'student' && !row.original.isPublished && (isAdmin || isSubjectTeacherOf(row.original.subject?._id || row.original.subjectId)) ? <button type="button" onClick={() => setConfirm({ type: 'delete', id: row.original._id })} className="rounded-full bg-white p-2 text-error"><Trash2 className="h-4 w-4" /></button> : null}
          </div>
        ),
      },
    ],
    [isAdmin, isSubjectTeacherOf, navigate, role]
  );

  return (
    <PageWrapper>
      <PageHeader
        title="Tests & Results"
        description="Create assessments, collect marks, publish results, and track performance."
        actions={role !== 'student' && (isAdmin || subjects.some((subject) => isSubjectTeacherOf(subject._id))) ? <Link to="/tests/new"><PrimaryButton><span className="inline-flex items-center gap-2"><PlusCircle className="h-4 w-4" /> Create Test</span></PrimaryButton></Link> : null}
      />

      <div className="glass-panel grid gap-4 p-6 md:grid-cols-2">
        <SelectInput label="Subject" value={filters.subjectId} onChange={(value) => setFilters((current) => ({ ...current, subjectId: value }))} options={buildOptions(subjects)} placeholder="All subjects" />
        <SelectInput label="Section" value={filters.sectionId} onChange={(value) => setFilters((current) => ({ ...current, sectionId: value }))} options={buildOptions(sections)} placeholder="All sections" />
      </div>

      {loading ? <Loader label="Loading tests..." /> : null}
      {!loading && !list.length ? <EmptyState title="No tests found" message="Assessments created for subjects will appear here." /> : null}
      {!loading && list.length ? <DataTable columns={columns} data={list} /> : null}

      <ConfirmDialog
        isOpen={Boolean(confirm.id)}
        title={confirm.type === 'publish' ? 'Publish Test' : 'Delete Test'}
        message={confirm.type === 'publish' ? 'Publishing will lock editing for teachers. Continue?' : 'Only unpublished tests can be removed. Continue?'}
        confirmText={confirm.type === 'publish' ? 'Publish' : 'Delete'}
        onCancel={() => setConfirm({ type: null, id: null })}
        onConfirm={async () => {
          const action = confirm.type === 'publish' ? publishTest(confirm.id) : deleteTest(confirm.id);
          const result = await dispatch(action);
          if (!result.error) setConfirm({ type: null, id: null });
        }}
        loading={loading}
      />
    </PageWrapper>
  );
};

export default Tests;
