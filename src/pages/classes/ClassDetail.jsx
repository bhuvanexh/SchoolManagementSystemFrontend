import { Pencil, PlusCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';

import Badge from '../../components/data-display/Badge';
import ConfirmDialog from '../../components/feedback/ConfirmDialog';
import Loader from '../../components/feedback/Loader';
import PageHeader from '../../components/layout/PageHeader';
import PageWrapper from '../../components/layout/PageWrapper';
import { fetchClassById } from '../../redux/actions/classActions';
import { deleteSection, fetchSectionsByClass, reassignClassTeacher } from '../../redux/actions/sectionActions';
import { fetchTeachers } from '../../redux/actions/teacherActions';
import { buildOptions } from '../../utils/helpers';
import ClassTeacherAssign from './components/ClassTeacherAssign';
import SectionForm from './components/SectionForm';
import SectionList from './components/SectionList';

const ClassDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, loading } = useSelector((state) => state.classes);
  const sections = useSelector((state) => state.sections.list);
  const teachers = useSelector((state) => state.teachers.list);
  const role = useSelector((state) => state.auth.user?.role);
  const [sectionModal, setSectionModal] = useState(false);
  const [reassignSection, setReassignSection] = useState(null);
  const [deleteSectionItem, setDeleteSectionItem] = useState(null);

  useEffect(() => {
    dispatch(fetchClassById(id));
    dispatch(fetchSectionsByClass(id));
    dispatch(fetchTeachers());
  }, [dispatch, id]);

  const teacherOptions = useMemo(() => buildOptions(teachers), [teachers]);

  if (loading && !current) return <Loader label="Loading class details..." />;

  return (
    <PageWrapper>
      <PageHeader
        title={current?.name || 'Class Detail'}
        description="This class hub brings together sections, enrolled students, and active subjects."
        actions={
          role === 'admin' ? (
            <Link to={`/classes/${id}/edit`}><button type="button" className="btn-primary inline-flex items-center gap-2"><Pencil className="h-4 w-4" /> Edit Class</button></Link>
          ) : null
        }
      />

      <section className="glass-panel p-6">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div><p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Academic Year</p><p className="mt-2 font-semibold text-on-surface">{current?.academicYear || '—'}</p></div>
          <div><p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Structure</p><div className="mt-2"><Badge tone="primary">{current?.hasSections ? 'Has Sections' : 'Class Level'}</Badge></div></div>
          <div><p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Teacher</p><p className="mt-2 font-semibold text-on-surface">{current?.hasSections ? 'See section assignments' : current?.classTeacher?.name || 'Unassigned'}</p></div>
          <div><p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Students</p><p className="mt-2 font-semibold text-on-surface">{current?.studentCount || 0}</p></div>
        </div>
      </section>

      {current?.hasSections ? (
        <section className="glass-panel p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-on-surface">Sections</h2>
            {role === 'admin' ? <button type="button" onClick={() => setSectionModal(true)} className="btn-primary inline-flex items-center gap-2"><PlusCircle className="h-4 w-4" /> Add Section</button> : null}
          </div>
          <SectionList
            sections={sections}
            onEdit={() => setSectionModal(true)}
            onDelete={(section) => setDeleteSectionItem(section)}
            onReassign={(section) => setReassignSection(section)}
          />
        </section>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="glass-panel p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-on-surface">Students</h2>
            <button type="button" onClick={() => navigate(`/students/new?classId=${id}`)} className="text-sm font-semibold text-primary">Add Student</button>
          </div>
          <div className="space-y-3">
            {(current?.students || []).slice(0, 6).map((student) => (
              <button key={student._id} type="button" onClick={() => navigate(`/students/${student._id}`)} className="w-full rounded-glass-sm bg-white/50 p-4 text-left">
                <p className="font-semibold text-on-surface">{student.name}</p>
                <p className="mt-1 text-sm text-on-surface-variant">Roll {student.rollNumber} · {student.section?.name || current?.name}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="glass-panel p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-on-surface">Subjects</h2>
            <button type="button" onClick={() => navigate(`/subjects/new?classId=${id}`)} className="text-sm font-semibold text-primary">Add Subject</button>
          </div>
          <div className="space-y-3">
            {(current?.subjects || []).slice(0, 6).map((subject) => (
              <button key={subject._id} type="button" onClick={() => navigate(`/subjects/${subject._id}/edit`)} className="w-full rounded-glass-sm bg-white/50 p-4 text-left">
                <p className="font-semibold text-on-surface">{subject.name}</p>
                <p className="mt-1 text-sm text-on-surface-variant">{subject.section?.name || current?.name} · {subject.subjectTeacher?.name || 'Unassigned'}</p>
              </button>
            ))}
          </div>
        </section>
      </div>

      <SectionForm
        isOpen={sectionModal}
        teachers={teacherOptions}
        onClose={() => setSectionModal(false)}
        onSubmit={() => setSectionModal(false)}
        loading={loading}
      />

      <ClassTeacherAssign
        isOpen={Boolean(reassignSection)}
        teachers={teacherOptions}
        onClose={() => setReassignSection(null)}
        onSubmit={async (teacherId) => {
          const result = await dispatch(reassignClassTeacher({ id: reassignSection._id, classTeacherId: teacherId }));
          if (!result.error) setReassignSection(null);
        }}
        loading={loading}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteSectionItem)}
        title="Delete Section"
        message="Sections can only be removed when no students are enrolled. Continue?"
        confirmText="Delete"
        onCancel={() => setDeleteSectionItem(null)}
        onConfirm={async () => {
          const result = await dispatch(deleteSection(deleteSectionItem._id));
          if (!result.error) setDeleteSectionItem(null);
        }}
        loading={loading}
      />
    </PageWrapper>
  );
};

export default ClassDetail;
