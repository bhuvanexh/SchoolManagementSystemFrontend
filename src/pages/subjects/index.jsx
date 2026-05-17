import { BookOpen, CheckSquare, Pencil, PenTool, PlusCircle, Trash2, UserCog2 } from 'lucide-react';
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
  const role = useSelector((state) => state.auth.user?.role);
  const { list, loading } = useSelector((state) => state.subjects);
  const { canCreateScopedContent, canManageSubjectsIn, isAdmin } = usePermission();
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

  // Teachers cannot create or edit subjects directly. Only admins can.
  const canManageSubjects = isAdmin;
  // Show actions column only when admin OR when in My Subjects (teacher shortcuts)
  const showActions = canManageSubjects || isMyScope;
  // Show Add button only when admin
  const showAddButton = canManageSubjects && canCreateScopedContent;

  const baseColumns = useMemo(() => ([
    { header: 'Subject Name', accessorKey: 'name' },
    { header: 'Core Subject', cell: ({ row }) => row.original.coreSubjectId?.name || '—' },
    {
      header: 'Class',
      cell: ({ row }) => {
        const className = row.original.classId?.name;
        const sectionName = row.original.sectionId?.name;
        const classId = row.original.classId?._id;
        if (!className) return '—';
        const label = !sectionName || sectionName === 'Default' ? className : `${className}-${sectionName}`;
        return classId
          ? <button type="button" onClick={() => navigate(`/classes/${classId}`)} className="font-semibold text-primary hover:underline">{label}</button>
          : label;
      },
    },
    {
      header: 'Subject Teacher',
      cell: ({ row }) => {
        const teacher = row.original.subjectTeacherId;
        if (!teacher) return '—';
        return (
          <button type="button" onClick={() => navigate(`/teachers/${teacher._id}`)} className="font-semibold text-primary hover:underline">
            {teacher.name}
          </button>
        );
      },
    },
    { header: 'Periods/Week', accessorKey: 'periodsPerWeek' },
  ]), [navigate]);

  const columns = useMemo(() => {
    if (!showActions) return baseColumns;
    return [
      ...baseColumns,
      {
        header: 'Actions',
        cell: ({ row }) => {
          const subjectId = row.original._id;
          const classId = row.original.classId?._id;
          const sectionId = row.original.sectionId?._id;
          // My Subjects (teacher): show syllabus + tests shortcuts
          if (isMyScope) {
            const sParam = new URLSearchParams();
            if (classId) sParam.set('classId', classId);
            if (sectionId) sParam.set('sectionId', sectionId);
            sParam.set('subjectId', subjectId);
            return (
              <div className="flex gap-2">
                <Tooltip text="Manage syllabus">
                  <button type="button" onClick={() => navigate(`/syllabus?${sParam.toString()}`)} className="rounded-full bg-white p-2 text-primary">
                    <CheckSquare className="h-4 w-4" />
                  </button>
                </Tooltip>
                <Tooltip text="Manage tests">
                  <button type="button" onClick={() => navigate(`/tests?${sParam.toString()}`)} className="rounded-full bg-white p-2 text-tertiary">
                    <PenTool className="h-4 w-4" />
                  </button>
                </Tooltip>
              </div>
            );
          }
          // All Subjects (admin only — teachers don't have this column)
          return (
            <div className="flex gap-2">
              {canManageSubjectsIn(sectionId) ? <Tooltip text="Edit subject"><button type="button" onClick={() => navigate(`/subjects/${subjectId}/edit`)} className="rounded-full bg-white p-2 text-secondary"><Pencil className="h-4 w-4" /></button></Tooltip> : null}
              {canManageSubjectsIn(sectionId) ? <Tooltip text="Assign teacher"><button type="button" onClick={() => navigate(`/subjects/${subjectId}/edit`)} className="rounded-full bg-white p-2 text-primary"><UserCog2 className="h-4 w-4" /></button></Tooltip> : null}
              {canManageSubjectsIn(sectionId) ? <Tooltip text="Delete subject"><button type="button" onClick={() => setDeleteId(subjectId)} className="rounded-full bg-white p-2 text-error"><Trash2 className="h-4 w-4" /></button></Tooltip> : null}
            </div>
          );
        },
      },
    ];
  }, [baseColumns, showActions, isMyScope, canManageSubjectsIn, navigate]);

  return (
    <PageWrapper>
      <PageHeader
        title={isMyScope ? 'My Subjects' : 'Subjects'}
        description={
          isMyScope
            ? 'Subjects you are assigned to teach.'
            : 'Per-section subject records, teacher assignments, and weekly periods.'
        }
        actions={showAddButton && !isMyScope ? <Link to="/subjects/new"><PrimaryButton><span className="inline-flex items-center gap-2"><PlusCircle className="h-4 w-4" /> Add Subject</span></PrimaryButton></Link> : null}
      />

      {!isMyScope ? <ClassSectionFilter className="md:grid-cols-2" /> : null}

      {loading ? <Loader label="Loading subjects..." /> : null}
      {!loading && !list.length ? (
        <EmptyState
          title="No subjects found"
          message={isMyScope ? 'You have not been assigned as subject teacher of any subject yet.' : 'No subjects to display for the current filters.'}
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
