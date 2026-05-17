import { ArrowRightLeft, Eye, Pencil, UserPlus, UserX } from 'lucide-react';
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
import SearchInput from '../../components/inputs/SearchInput';
import SelectInput from '../../components/inputs/SelectInput';
import Modal from '../../components/modal/Modal';
import PageHeader from '../../components/layout/PageHeader';
import PageWrapper from '../../components/layout/PageWrapper';
import useDebounce from '../../hooks/useDebounce';
import useFilterParams from '../../hooks/useFilterParams';
import usePermission from '../../hooks/usePermission';
import { fetchClasses } from '../../redux/actions/classActions';
import { deactivateStudent, fetchStudents, transferStudent } from '../../redux/actions/studentActions';
import { buildOptions } from '../../utils/helpers';

const Students = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scope = searchParams.get('scope');
  const isMyScope = scope === 'my';
  const { list, loading } = useSelector((state) => state.students);
  const sections = useSelector((state) => state.sections.list);
  const profile = useSelector((state) => state.auth.profile);
  const role = useSelector((state) => state.auth.user?.role);
  const { canCreateScopedContent, canManageStudentsIn, isAdmin } = usePermission();
  const [params, setParams] = useFilterParams();
  const [deactivateId, setDeactivateId] = useState(null);
  const [transferState, setTransferState] = useState({ id: null, sectionId: '' });
  const debouncedSearch = useDebounce(params.search);

  // For teachers: figure out how many distinct class-teacher assignments they have
  const teacherAssignmentsCount =
    (profile?.classTeacherSections?.length || 0) + (profile?.classTeacherClasses?.length || 0);

  // Show class/section filter only when admin OR when teacher has multiple assignments
  const showFilters = isAdmin || (role !== 'teacher') || teacherAssignmentsCount > 1;

  useEffect(() => {
    if (!isMyScope) dispatch(fetchClasses());
  }, [dispatch, isMyScope]);

  useEffect(() => {
    if (isMyScope) {
      dispatch(fetchStudents({ scope: 'my', search: debouncedSearch }));
    } else {
      dispatch(fetchStudents({ classId: params.classId, sectionId: params.sectionId, search: debouncedSearch }));
    }
  }, [params.classId, params.sectionId, debouncedSearch, dispatch, isMyScope]);

  const canEdit = isAdmin || isMyScope; // teachers only manage in My Students
  const canShowAddButton = role !== 'student' && canCreateScopedContent && (isAdmin || isMyScope);

  const columns = useMemo(
    () => [
      { header: 'Roll No', accessorKey: 'rollNumber' },
      {
        header: 'Student Name',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => navigate(`/students/${row.original._id}`)}
            className="text-left font-semibold text-primary hover:underline"
          >
            {row.original.name}
          </button>
        ),
      },
      { header: 'Parent Name', accessorKey: 'parentName' },
      { header: 'Parent Contact', accessorKey: 'parentContact' },
      {
        header: 'Class',
        cell: ({ row }) => {
          const className = row.original.sectionId?.classId?.name;
          const sectionName = row.original.sectionId?.name;
          const classId = row.original.sectionId?.classId?._id;
          if (!className) return '—';
          const label = !sectionName || sectionName === 'Default' ? className : `${className}-${sectionName}`;
          return classId ? (
            <button type="button" onClick={() => navigate(`/classes/${classId}`)} className="font-semibold text-primary hover:underline">{label}</button>
          ) : label;
        },
      },
      { header: 'Status', cell: ({ row }) => row.original.isActive === false ? 'Inactive' : 'Active' },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Tooltip text="View profile"><button type="button" onClick={() => navigate(`/students/${row.original._id}`)} className="rounded-full bg-white p-2 text-primary"><Eye className="h-4 w-4" /></button></Tooltip>
            {canEdit && canManageStudentsIn(row.original.sectionId?._id || row.original.sectionId)
              ? <Tooltip text="Edit student"><button type="button" onClick={() => navigate(`/students/${row.original._id}/edit`)} className="rounded-full bg-white p-2 text-secondary"><Pencil className="h-4 w-4" /></button></Tooltip>
              : null}
            {isAdmin ? <Tooltip text="Transfer section"><button type="button" onClick={() => setTransferState({ id: row.original._id, sectionId: row.original.sectionId?._id || '' })} className="rounded-full bg-white p-2 text-tertiary"><ArrowRightLeft className="h-4 w-4" /></button></Tooltip> : null}
            {isAdmin ? <Tooltip text="Deactivate"><button type="button" onClick={() => setDeactivateId(row.original._id)} className="rounded-full bg-white p-2 text-error"><UserX className="h-4 w-4" /></button></Tooltip> : null}
          </div>
        ),
      },
    ],
    [canManageStudentsIn, canEdit, isAdmin, navigate]
  );

  return (
    <PageWrapper>
      <PageHeader
        title={isMyScope ? 'My Students' : 'Students'}
        description={
          isMyScope
            ? 'Students in your assigned classes and sections.'
            : 'Track enrollment, family contacts, section placement, and active status.'
        }
        actions={canShowAddButton ? <Link to="/students/new"><PrimaryButton><span className="inline-flex items-center gap-2"><UserPlus className="h-4 w-4" /> Add Student</span></PrimaryButton></Link> : null}
      />

      {isMyScope ? (
        // My Students: only show search (no class/section filter needed since it's scoped)
        <div className="glass-panel grid gap-4 p-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Search</label>
            <SearchInput
              value={params.search || ''}
              onChange={(e) => setParams({ search: e.target.value })}
              placeholder="Search students..."
            />
          </div>
        </div>
      ) : showFilters ? (
        <ClassSectionFilter
          showSearch
          searchPlaceholder="Search students..."
          className="lg:grid-cols-3"
        />
      ) : (
        // Teacher with single assignment, viewing All Students with their filter implicit: just show search
        <div className="glass-panel grid gap-4 p-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Search</label>
            <SearchInput
              value={params.search || ''}
              onChange={(e) => setParams({ search: e.target.value })}
              placeholder="Search students..."
            />
          </div>
        </div>
      )}

      {loading ? <Loader label="Loading students..." /> : null}
      {!loading && !list.length ? <EmptyState title="No students found" message={isMyScope ? 'No students found in your assigned sections.' : 'Student records will appear here once admissions are added.'} /> : null}
      {!loading && list.length ? <DataTable columns={columns} data={list} /> : null}

      <ConfirmDialog
        isOpen={Boolean(deactivateId)}
        title="Deactivate Student"
        message="The student login will be disabled, but historical academic records will remain."
        confirmText="Deactivate"
        onCancel={() => setDeactivateId(null)}
        onConfirm={async () => {
          const result = await dispatch(deactivateStudent(deactivateId));
          if (!result.error) setDeactivateId(null);
        }}
        loading={loading}
      />

      <Modal
        isOpen={Boolean(transferState.id)}
        title="Transfer Student"
        onClose={() => setTransferState({ id: null, sectionId: '' })}
        footer={
          <>
            <button type="button" className="btn-secondary" onClick={() => setTransferState({ id: null, sectionId: '' })}>Cancel</button>
            <button
              type="button"
              className="btn-primary"
              disabled={!transferState.sectionId || loading}
              onClick={async () => {
                const result = await dispatch(transferStudent(transferState));
                if (!result.error) setTransferState({ id: null, sectionId: '' });
              }}
            >
              {loading ? 'Saving...' : 'Transfer'}
            </button>
          </>
        }
      >
        <SelectInput
          value={transferState.sectionId}
          onChange={(value) => setTransferState((current) => ({ ...current, sectionId: value }))}
          options={buildOptions(sections)}
          placeholder="Choose destination section"
        />
      </Modal>
    </PageWrapper>
  );
};

export default Students;
