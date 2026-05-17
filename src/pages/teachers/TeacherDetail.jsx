import { Pencil, UserX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import PrimaryButton from '../../components/buttons/PrimaryButton';
import Badge from '../../components/data-display/Badge';
import ConfirmDialog from '../../components/feedback/ConfirmDialog';
import EmptyState from '../../components/feedback/EmptyState';
import Loader from '../../components/feedback/Loader';
import PageHeader from '../../components/layout/PageHeader';
import PageWrapper from '../../components/layout/PageWrapper';
import { deactivateTeacher, fetchTeacherById } from '../../redux/actions/teacherActions';
import { clearCurrentTeacher } from '../../redux/slices/teacherSlice';

const Field = ({ label, value }) => (
  <div>
    <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">{label}</p>
    <p className="mt-2 font-semibold text-on-surface">{value || '—'}</p>
  </div>
);

const TeacherDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user?.role);
  const { current, loading } = useSelector((state) => state.teachers);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    dispatch(clearCurrentTeacher());
    dispatch(fetchTeacherById(id));
    return () => {
      dispatch(clearCurrentTeacher());
    };
  }, [dispatch, id]);

  if (loading && !current) return <Loader label="Loading teacher details..." />;

  const classTeacherOf = current?.assignments?.classTeacherOf || [];
  const sectionTeacherOf = current?.assignments?.sectionTeacherOf || [];
  const subjectTeacherOf = current?.assignments?.subjectTeacherOf || [];
  const hasAnyClassAssignment = classTeacherOf.length > 0 || sectionTeacherOf.length > 0;

  return (
    <PageWrapper>
      <PageHeader
        backTo="/teachers"
        backLabel="Back to Teachers"
        title={current?.name || 'Teacher Detail'}
        description="Full profile, assignment visibility, and responsibilities."
        actions={role === 'admin' ? (
          <>
            <Link to={`/teachers/${id}/edit`}><PrimaryButton><span className="inline-flex items-center gap-2"><Pencil className="h-4 w-4" /> Edit</span></PrimaryButton></Link>
            <button type="button" onClick={() => setConfirmOpen(true)} className="btn-secondary inline-flex items-center gap-2 text-error">
              <UserX className="h-4 w-4" /> Deactivate
            </button>
          </>
        ) : null}
      />

      <section className="glass-panel p-6">
        <h2 className="mb-5 text-lg font-bold text-on-surface">Profile</h2>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Field label="Teacher ID" value={current?.teacherId} />
          <Field label="Email" value={current?.email} />
          <Field label="Phone" value={current?.phone} />
          <Field label="Qualification" value={current?.qualification} />
          <Field label="Experience" value={current?.experience ? `${current.experience} years` : null} />
          <Field label="Username" value={current?.userId?.username} />
          <div className="xl:col-span-3">
            <Field label="Address" value={current?.address} />
          </div>
          {current?.notes ? (
            <div className="xl:col-span-3">
              <Field label="Notes" value={current.notes} />
            </div>
          ) : null}
          <div className="md:col-span-2 xl:col-span-3">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Core Subjects</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(current?.coreSubjects || []).map((s) => (
                <Badge key={s._id || s} tone="primary">{s.name || s}</Badge>
              ))}
              {!(current?.coreSubjects?.length) && <span className="text-sm text-on-surface-variant">—</span>}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="glass-panel p-6">
          <h2 className="text-xl font-bold text-on-surface">Class Teacher Of</h2>
          {!hasAnyClassAssignment ? (
            <p className="mt-4 text-sm text-on-surface-variant">Not assigned as class teacher yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {classTeacherOf.map((cls) => (
                <Link key={cls._id} to={`/classes/${cls._id}`} className="block rounded-glass-sm bg-white/50 p-4 transition hover:bg-white/70">
                  <p className="font-semibold text-on-surface">Class {cls.name}</p>
                  {cls.academicYear ? <p className="mt-1 text-sm text-on-surface-variant">Academic Year {cls.academicYear}</p> : null}
                </Link>
              ))}
              {sectionTeacherOf.map((sec) => (
                <Link key={sec._id} to={`/classes/${sec.classId?._id || ''}`} className="block rounded-glass-sm bg-white/50 p-4 transition hover:bg-white/70">
                  <p className="font-semibold text-on-surface">
                    Class {sec.classId?.name}{sec.name && sec.name !== 'Default' ? `-${sec.name}` : ''}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="glass-panel p-6">
          <h2 className="text-xl font-bold text-on-surface">Subject Teacher Of</h2>
          {subjectTeacherOf.length === 0 ? (
            <p className="mt-4 text-sm text-on-surface-variant">Not assigned as subject teacher yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {subjectTeacherOf.map((sub) => (
                <Link key={sub._id} to={`/classes/${sub.classId?._id || ''}`} className="block rounded-glass-sm bg-white/50 p-4 transition hover:bg-white/70">
                  <p className="font-semibold text-on-surface">{sub.name}</p>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    Class {sub.classId?.name}{sub.sectionId?.name && sub.sectionId.name !== 'Default' ? `-${sub.sectionId.name}` : ''}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Deactivate Teacher"
        message="This teacher will be deactivated. Historical attendance and result records will stay intact."
        confirmText="Deactivate"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => {
          const result = await dispatch(deactivateTeacher({ id }));
          if (!result.error) setConfirmOpen(false);
        }}
        loading={loading}
      />
    </PageWrapper>
  );
};

export default TeacherDetail;
