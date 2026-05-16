import { Eye, Pencil, PlusCircle, School2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import SecondaryButton from '../../components/buttons/SecondaryButton';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import Badge from '../../components/data-display/Badge';
import DataTable from '../../components/data-display/DataTable';
import ConfirmDialog from '../../components/feedback/ConfirmDialog';
import EmptyState from '../../components/feedback/EmptyState';
import Loader from '../../components/feedback/Loader';
import PageHeader from '../../components/layout/PageHeader';
import PageWrapper from '../../components/layout/PageWrapper';
import Modal from '../../components/modal/Modal';
import { deactivateClass, fetchClasses } from '../../redux/actions/classActions';
import { fetchSectionsByClass } from '../../redux/actions/sectionActions';

const Classes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scope = searchParams.get('scope');
  const { list, loading } = useSelector((state) => state.classes);
  const sections = useSelector((state) => state.sections.list);
  const sectionsLoading = useSelector((state) => state.sections.loading);
  const userRole = useSelector((state) => state.auth.user?.role);
  const profile = useSelector((state) => state.auth.profile);
  const [deleteId, setDeleteId] = useState(null);
  const [sectionsClass, setSectionsClass] = useState(null);

  const isMyScope = scope === 'my' && userRole === 'teacher';

  useEffect(() => {
    if (!isMyScope) dispatch(fetchClasses());
  }, [dispatch, isMyScope]);

  const myAssignments = useMemo(() => {
    if (!isMyScope) return null;
    return [
      ...(profile?.classTeacherSections || []).map((s) => ({
        id: s.sectionId,
        label: `Class ${s.className} — Section ${s.sectionName}`,
        sectionId: s.sectionId,
        classId: s.classId,
        type: 'Section Teacher',
      })),
      ...(profile?.classTeacherClasses || []).map((c) => ({
        id: c.classId,
        label: `Class ${c.className}`,
        sectionId: null,
        classId: c.classId,
        type: 'Class Teacher',
      })),
    ];
  }, [isMyScope, profile]);

  const handleViewSections = (cls) => {
    setSectionsClass(cls);
    dispatch(fetchSectionsByClass(cls._id));
  };

  const columns = useMemo(
    () => [
      { header: 'Class Name', accessorKey: 'name' },
      { header: 'Has Sections', cell: ({ row }) => <Badge tone="primary">{row.original.hasSections ? 'Yes' : 'No'}</Badge> },
      { header: 'Academic Year', accessorKey: 'academicYear' },
      {
        header: 'Class Teacher',
        cell: ({ row }) =>
          row.original.hasSections ? (
            <button
              type="button"
              onClick={() => handleViewSections(row.original)}
              className="text-sm font-semibold text-primary hover:underline"
            >
              See sections
            </button>
          ) : (
            row.original.classTeacherId?.name || 'Unassigned'
          ),
      },
      {
        header: 'Students',
        cell: ({ row }) => row.original.studentCount ?? 0,
      },
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
        title={isMyScope ? 'My Classes' : 'Classes'}
        description={
          isMyScope
            ? 'Classes and sections where you are assigned as class teacher.'
            : 'Track class structures, section setup, staffing, and enrollment.'
        }
        actions={
          !isMyScope && userRole === 'admin' ? (
            <Link to="/classes/new"><PrimaryButton><span className="inline-flex items-center gap-2"><PlusCircle className="h-4 w-4" /> Add Class</span></PrimaryButton></Link>
          ) : null
        }
      />

      {isMyScope ? (
        <section className="glass-panel p-6">
          {!myAssignments?.length ? (
            <EmptyState title="No assignments" message="You have not been assigned as class teacher of any class or section yet." />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {myAssignments.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-glass-sm bg-white/50 p-4">
                  <div>
                    <p className="font-semibold text-on-surface">{item.label}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant">{item.type}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        item.sectionId
                          ? `/students?sectionId=${item.sectionId}`
                          : `/students?classId=${item.classId}`
                      )
                    }
                    className="btn-secondary text-xs"
                  >
                    View Students
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          {loading ? <Loader label="Loading classes..." /> : null}
          {!loading && !list.length ? <EmptyState title="No classes found" message="Create your first class to begin managing sections and students." /> : null}
          {!loading && list.length ? <DataTable columns={columns} data={list} /> : null}
        </>
      )}

      <Modal
        isOpen={Boolean(sectionsClass)}
        title={`Class ${sectionsClass?.name} — Sections`}
        onClose={() => setSectionsClass(null)}
        footer={<SecondaryButton type="button" onClick={() => setSectionsClass(null)}>Close</SecondaryButton>}
      >
        {sectionsLoading ? (
          <Loader label="Loading sections..." />
        ) : sections.length === 0 ? (
          <p className="text-sm text-on-surface-variant">No sections found for this class.</p>
        ) : (
          <div className="space-y-3">
            {sections.map((section) => (
              <div key={section._id} className="rounded-glass-sm bg-white/50 p-4">
                <p className="font-semibold text-on-surface">Section {section.name}</p>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Teacher: {section.classTeacherId?.name || 'Unassigned'} · Students: {section.studentCount ?? 0}
                </p>
              </div>
            ))}
          </div>
        )}
      </Modal>

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
