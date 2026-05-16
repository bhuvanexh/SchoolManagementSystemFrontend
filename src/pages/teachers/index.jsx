import { Eye, Pencil, UserPlus, UserX } from 'lucide-react';
import Tooltip from '../../components/data-display/Tooltip';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import PrimaryButton from '../../components/buttons/PrimaryButton';
import Badge from '../../components/data-display/Badge';
import DataTable from '../../components/data-display/DataTable';
import ConfirmDialog from '../../components/feedback/ConfirmDialog';
import EmptyState from '../../components/feedback/EmptyState';
import Loader from '../../components/feedback/Loader';
import SearchInput from '../../components/inputs/SearchInput';
import SelectInput from '../../components/inputs/SelectInput';
import PageHeader from '../../components/layout/PageHeader';
import PageWrapper from '../../components/layout/PageWrapper';
import useDebounce from '../../hooks/useDebounce';
import { fetchCoreSubjects } from '../../redux/actions/coreSubjectActions';
import { deactivateTeacher, fetchTeachers } from '../../redux/actions/teacherActions';
import { buildOptions } from '../../utils/helpers';

const Teachers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading } = useSelector((state) => state.teachers);
  const coreSubjectList = useSelector((state) => state.coreSubjects.list);
  const [search, setSearch] = useState('');
  const [coreSubject, setCoreSubject] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    dispatch(fetchCoreSubjects());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchTeachers({ search: debouncedSearch, coreSubject }));
  }, [coreSubject, debouncedSearch, dispatch]);

  const columns = useMemo(
    () => [
      { header: 'Teacher ID', accessorKey: 'teacherId' },
      { header: 'Name', accessorKey: 'name' },
      { header: 'Email', accessorKey: 'email' },
      { header: 'Phone', accessorKey: 'phone' },
      {
        header: 'Core Subjects',
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            {(row.original.coreSubjects || []).map((subject) => (
              <Badge key={subject._id || subject} tone="primary">{subject.name || subject}</Badge>
            ))}
          </div>
        ),
      },
      {
        header: 'Status',
        cell: ({ row }) => <Badge tone={row.original.isActive === false ? 'error' : 'success'}>{row.original.isActive === false ? 'Inactive' : 'Active'}</Badge>,
      },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Tooltip text="View profile"><button type="button" onClick={() => navigate(`/teachers/${row.original._id}`)} className="rounded-full bg-white p-2 text-primary"><Eye className="h-4 w-4" /></button></Tooltip>
            <Tooltip text="Edit teacher"><button type="button" onClick={() => navigate(`/teachers/${row.original._id}/edit`)} className="rounded-full bg-white p-2 text-secondary"><Pencil className="h-4 w-4" /></button></Tooltip>
            <Tooltip text="Remove teacher"><button type="button" onClick={() => setDeleteId(row.original._id)} className="rounded-full bg-white p-2 text-error"><UserX className="h-4 w-4" /></button></Tooltip>
          </div>
        ),
      },
    ],
    [navigate]
  );

  return (
    <PageWrapper>
      <PageHeader
        title="Teachers"
        description="Manage teacher profiles, subject specializations, and school staffing records."
        actions={<Link to="/teachers/new"><PrimaryButton><span className="inline-flex items-center gap-2"><UserPlus className="h-4 w-4" /> Add Teacher</span></PrimaryButton></Link>}
      />

      <div className="glass-panel grid gap-4 p-6 md:grid-cols-[1fr_280px]">
        <SearchInput value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search teachers" />
        <SelectInput value={coreSubject} onChange={(value) => setCoreSubject(value)} options={buildOptions(coreSubjectList)} placeholder="Filter by core subject" />
      </div>

      {loading ? <Loader label="Loading teachers..." /> : null}
      {!loading && !list.length ? (
        <EmptyState title="No teachers found" message="Create your first teacher profile to begin assignments." actionLabel="Add Teacher" onAction={() => navigate('/teachers/new')} />
      ) : null}
      {!loading && list.length ? <DataTable columns={columns} data={list} /> : null}

      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Deactivate Teacher"
        message="This teacher will lose access, but historical records will be preserved."
        confirmText="Deactivate"
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          await dispatch(deactivateTeacher({ id: deleteId }));
          setDeleteId(null);
        }}
        loading={loading}
      />
    </PageWrapper>
  );
};

export default Teachers;
