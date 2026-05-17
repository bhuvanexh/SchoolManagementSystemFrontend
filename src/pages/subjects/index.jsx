import { Pencil, PlusCircle, UserCog2, Trash2 } from 'lucide-react';
import Tooltip from '../../components/data-display/Tooltip';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import PrimaryButton from '../../components/buttons/PrimaryButton';
import DataTable from '../../components/data-display/DataTable';
import ConfirmDialog from '../../components/feedback/ConfirmDialog';
import EmptyState from '../../components/feedback/EmptyState';
import Loader from '../../components/feedback/Loader';
import ClassSectionFilter from '../../components/filters/ClassSectionFilter';
import PageHeader from '../../components/layout/PageHeader';
import PageWrapper from '../../components/layout/PageWrapper';
import useFilterParams from '../../hooks/useFilterParams';
import usePermission from '../../hooks/usePermission';
import { fetchClasses } from '../../redux/actions/classActions';
import { deleteSubject, fetchSubjects } from '../../redux/actions/subjectActions';

const Subjects = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scope = searchParams.get('scope');
  const isMyScope = scope === 'my';
  const { list, loading } = useSelector((state) => state.subjects);
  const { canCreateScopedContent, canManageSubjectsIn } = usePermission();
  const [params] = useFilterParams();
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (!isMyScope) dispatch(fetchClasses());
  }, [dispatch, isMyScope]);

  useEffect(() => {
    if (isMyScope) {
      dispatch(fetchSubjects({ scope: 'my' }));
    } else {
      dispatch(fetchSubjects({ classId: params.classId, sectionId: params.sectionId }));
    }
  }, [params.classId, params.sectionId, dispatch, isMyScope]);

  const columns = useMemo(
    () => [
      { header: 'Subject Name', accessorKey: 'name' },
      { header: 'Core Subject', cell: ({ row }) => row.original.coreSubjectId?.name || '—' },
      {
        header: 'Class',
        cell: ({ row }) => {
          const className = row.original.classId?.name;
          const sectionName = row.original.sectionId?.name;
          if (!className) return '—';
          if (!sectionName || sectionName === 'Default') return className;
          return `${className}-${sectionName}`;
        },
      },
      { header: 'Subject Teacher', cell: ({ row }) => row.original.subjectTeacherId?.name || '—' },
      { header: 'Periods/Week', accessorKey: 'periodsPerWeek' },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            {canManageSubjectsIn(row.original.sectionId?._id) ? <Tooltip text="Edit subject"><button type="button" onClick={() => navigate(`/subjects/${row.original._id}/edit`)} className="rounded-full bg-white p-2 text-secondary"><Pencil className="h-4 w-4" /></button></Tooltip> : null}
            {canManageSubjectsIn(row.original.sectionId?._id) ? <Tooltip text="Assign teacher"><button type="button" onClick={() => navigate(`/subjects/${row.original._id}/edit`)} className="rounded-full bg-white p-2 text-primary"><UserCog2 className="h-4 w-4" /></button></Tooltip> : null}
            {canManageSubjectsIn(row.original.sectionId?._id) ? <Tooltip text="Delete subject"><button type="button" onClick={() => setDeleteId(row.original._id)} className="rounded-full bg-white p-2 text-error"><Trash2 className="h-4 w-4" /></button></Tooltip> : null}
          </div>
        ),
      },
    ],
    [canManageSubjectsIn, navigate]
  );

  return (
    <PageWrapper>
      <PageHeader
        title={isMyScope ? 'My Subjects' : 'Subjects'}
        description={
          isMyScope
            ? 'Subjects you are assigned to teach.'
            : 'Manage per-section subject records, teacher assignments, and weekly periods.'
        }
        actions={!isMyScope && canCreateScopedContent ? <Link to="/subjects/new"><PrimaryButton><span className="inline-flex items-center gap-2"><PlusCircle className="h-4 w-4" /> Add Subject</span></PrimaryButton></Link> : null}
      />

      {!isMyScope ? <ClassSectionFilter className="md:grid-cols-2" /> : null}

      {loading ? <Loader label="Loading subjects..." /> : null}
      {!loading && !list.length ? (
        <EmptyState
          title="No subjects found"
          message={isMyScope ? 'You have not been assigned as subject teacher of any subject yet.' : 'Create a subject to map teachers and academic planning to sections.'}
        />
      ) : null}
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
