import { Eye, Pencil, PlusCircle, School2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import PrimaryButton from '../../components/buttons/PrimaryButton';
import Badge from '../../components/data-display/Badge';
import DataTable from '../../components/data-display/DataTable';
import ConfirmDialog from '../../components/feedback/ConfirmDialog';
import EmptyState from '../../components/feedback/EmptyState';
import Loader from '../../components/feedback/Loader';
import PageHeader from '../../components/layout/PageHeader';
import PageWrapper from '../../components/layout/PageWrapper';
import { deactivateClass, fetchClasses } from '../../redux/actions/classActions';

const Classes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading } = useSelector((state) => state.classes);
  const userRole = useSelector((state) => state.auth.user?.role);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  const columns = useMemo(
    () => [
      { header: 'Class Name', accessorKey: 'name' },
      { header: 'Has Sections', cell: ({ row }) => <Badge tone="primary">{row.original.hasSections ? 'Yes' : 'No'}</Badge> },
      { header: 'Academic Year', accessorKey: 'academicYear' },
      { header: 'Class Teacher', cell: ({ row }) => row.original.hasSections ? 'See sections' : row.original.classTeacher?.name || 'Unassigned' },
      { header: 'Student Count', accessorKey: 'studentCount' },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button type="button" onClick={() => navigate(`/classes/${row.original._id}`)} className="rounded-full bg-white p-2 text-primary"><Eye className="h-4 w-4" /></button>
            {userRole === 'admin' ? <button type="button" onClick={() => navigate(`/classes/${row.original._id}/edit`)} className="rounded-full bg-white p-2 text-secondary"><Pencil className="h-4 w-4" /></button> : null}
            {userRole === 'admin' ? <button type="button" onClick={() => setDeleteId(row.original._id)} className="rounded-full bg-white p-2 text-error"><School2 className="h-4 w-4" /></button> : null}
          </div>
        ),
      },
    ],
    [navigate, userRole]
  );

  return (
    <PageWrapper>
      <PageHeader
        title={userRole === 'teacher' ? 'My Classes' : 'Classes'}
        description="Track class structures, section setup, staffing, and enrollment."
        actions={
          userRole === 'admin' ? (
            <Link to="/classes/new"><PrimaryButton><span className="inline-flex items-center gap-2"><PlusCircle className="h-4 w-4" /> Add Class</span></PrimaryButton></Link>
          ) : null
        }
      />

      {loading ? <Loader label="Loading classes..." /> : null}
      {!loading && !list.length ? <EmptyState title="No classes found" message="Create your first class to begin managing sections and students." /> : null}
      {!loading && list.length ? <DataTable columns={columns} data={list} /> : null}

      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Deactivate Class"
        message="This class will be deactivated but preserved for historical records."
        confirmText="Deactivate"
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          await dispatch(deactivateClass(deleteId));
          setDeleteId(null);
        }}
        loading={loading}
      />
    </PageWrapper>
  );
};

export default Classes;
