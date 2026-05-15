import { Pencil, UserX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import PrimaryButton from '../../components/buttons/PrimaryButton';
import Badge from '../../components/data-display/Badge';
import ConfirmDialog from '../../components/feedback/ConfirmDialog';
import Loader from '../../components/feedback/Loader';
import PageHeader from '../../components/layout/PageHeader';
import PageWrapper from '../../components/layout/PageWrapper';
import { deactivateTeacher, fetchTeacherById } from '../../redux/actions/teacherActions';

const TeacherDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current, loading } = useSelector((state) => state.teachers);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTeacherById(id));
  }, [dispatch, id]);

  if (loading && !current) return <Loader label="Loading teacher details..." />;

  return (
    <PageWrapper>
      <PageHeader
        title={current?.name || 'Teacher Detail'}
        description="Assignment visibility for class teacher and subject teacher responsibilities."
        actions={
          <>
            <Link to={`/teachers/${id}/edit`}><PrimaryButton><span className="inline-flex items-center gap-2"><Pencil className="h-4 w-4" /> Edit</span></PrimaryButton></Link>
            <button type="button" onClick={() => setConfirmOpen(true)} className="btn-secondary inline-flex items-center gap-2 text-error">
              <UserX className="h-4 w-4" /> Deactivate
            </button>
          </>
        }
      />

      <section className="glass-panel p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Teacher ID</p>
            <p className="mt-2 font-semibold text-on-surface">{current?.teacherId || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Contact</p>
            <p className="mt-2 font-semibold text-on-surface">{current?.email || '—'} · {current?.phone || '—'}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Core Subjects</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(current?.coreSubjects || []).map((subject) => (
                <Badge key={subject._id || subject} tone="primary">{subject.name || subject}</Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="glass-panel p-6">
          <h2 className="text-xl font-bold text-on-surface">Class Teacher Of</h2>
          <div className="mt-4 space-y-3">
            {(current?.classTeacherOf || []).map((item) => (
              <div key={item._id} className="rounded-glass-sm bg-white/50 p-4">
                <p className="font-semibold text-on-surface">{item.className} - {item.sectionName}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-panel p-6">
          <h2 className="text-xl font-bold text-on-surface">Subject Teacher Of</h2>
          <div className="mt-4 space-y-3">
            {(current?.subjectTeacherOf || []).map((item) => (
              <div key={item._id} className="rounded-glass-sm bg-white/50 p-4">
                <p className="font-semibold text-on-surface">{item.subjectName}</p>
                <p className="mt-1 text-sm text-on-surface-variant">{item.className} - {item.sectionName}</p>
              </div>
            ))}
          </div>
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
