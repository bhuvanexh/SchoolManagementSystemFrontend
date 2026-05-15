import { ArrowRightLeft, Eye, Pencil, UserPlus, UserX } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import PrimaryButton from '../../components/buttons/PrimaryButton';
import DataTable from '../../components/data-display/DataTable';
import ConfirmDialog from '../../components/feedback/ConfirmDialog';
import EmptyState from '../../components/feedback/EmptyState';
import Loader from '../../components/feedback/Loader';
import SelectInput from '../../components/inputs/SelectInput';
import SearchInput from '../../components/inputs/SearchInput';
import Modal from '../../components/modal/Modal';
import PageHeader from '../../components/layout/PageHeader';
import PageWrapper from '../../components/layout/PageWrapper';
import useDebounce from '../../hooks/useDebounce';
import { fetchClasses } from '../../redux/actions/classActions';
import { fetchSectionsByClass } from '../../redux/actions/sectionActions';
import { deactivateStudent, fetchStudents, transferStudent } from '../../redux/actions/studentActions';
import { buildOptions } from '../../utils/helpers';

const Students = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading } = useSelector((state) => state.students);
  const classes = useSelector((state) => state.classes.list);
  const sections = useSelector((state) => state.sections.list);
  const role = useSelector((state) => state.auth.user?.role);
  const [filters, setFilters] = useState({ classId: '', sectionId: '', search: '' });
  const [deactivateId, setDeactivateId] = useState(null);
  const [transferState, setTransferState] = useState({ id: null, sectionId: '' });
  const debouncedSearch = useDebounce(filters.search);

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchStudents({ sectionId: filters.sectionId, search: debouncedSearch }));
  }, [debouncedSearch, dispatch, filters.sectionId]);

  useEffect(() => {
    if (filters.classId) {
      dispatch(fetchSectionsByClass(filters.classId));
    }
  }, [dispatch, filters.classId]);

  const columns = useMemo(
    () => [
      { header: 'Roll No', accessorKey: 'rollNumber' },
      { header: 'Student Name', accessorKey: 'name' },
      { header: 'Parent Name', accessorKey: 'parentName' },
      { header: 'Parent Contact', accessorKey: 'parentContact' },
      { header: 'Section', cell: ({ row }) => row.original.section?.name || '—' },
      { header: 'Status', cell: ({ row }) => row.original.isActive === false ? 'Inactive' : 'Active' },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button type="button" onClick={() => navigate(`/students/${row.original._id}`)} className="rounded-full bg-white p-2 text-primary"><Eye className="h-4 w-4" /></button>
            {role !== 'student' ? <button type="button" onClick={() => navigate(`/students/${row.original._id}/edit`)} className="rounded-full bg-white p-2 text-secondary"><Pencil className="h-4 w-4" /></button> : null}
            {role === 'admin' ? <button type="button" onClick={() => setTransferState({ id: row.original._id, sectionId: row.original.section?._id || '' })} className="rounded-full bg-white p-2 text-tertiary"><ArrowRightLeft className="h-4 w-4" /></button> : null}
            {role === 'admin' ? <button type="button" onClick={() => setDeactivateId(row.original._id)} className="rounded-full bg-white p-2 text-error"><UserX className="h-4 w-4" /></button> : null}
          </div>
        ),
      },
    ],
    [navigate, role]
  );

  return (
    <PageWrapper>
      <PageHeader
        title="Students"
        description="Track enrollment, family contacts, section placement, and active status."
        actions={role !== 'student' ? <Link to="/students/new"><PrimaryButton><span className="inline-flex items-center gap-2"><UserPlus className="h-4 w-4" /> Add Student</span></PrimaryButton></Link> : null}
      />

      <div className="glass-panel grid gap-4 p-6 lg:grid-cols-3">
        <SelectInput
          value={filters.classId}
          onChange={(event) => setFilters((current) => ({ ...current, classId: event.target.value, sectionId: '' }))}
          options={buildOptions(classes)}
          placeholder="Filter by class"
        />
        <SelectInput
          value={filters.sectionId}
          onChange={(event) => setFilters((current) => ({ ...current, sectionId: event.target.value }))}
          options={buildOptions(sections)}
          placeholder="Filter by section"
        />
        <SearchInput value={filters.search} onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} placeholder="Search students" />
      </div>

      {loading ? <Loader label="Loading students..." /> : null}
      {!loading && !list.length ? <EmptyState title="No students found" message="Student records will appear here once admissions are added." /> : null}
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
          onChange={(event) => setTransferState((current) => ({ ...current, sectionId: event.target.value }))}
          options={buildOptions(sections)}
          placeholder="Choose destination section"
        />
      </Modal>
    </PageWrapper>
  );
};

export default Students;
