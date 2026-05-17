import { Pencil, PlusCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';

import Badge from '../../components/data-display/Badge';
import ConfirmDialog from '../../components/feedback/ConfirmDialog';
import EmptyState from '../../components/feedback/EmptyState';
import Loader from '../../components/feedback/Loader';
import PageHeader from '../../components/layout/PageHeader';
import PageWrapper from '../../components/layout/PageWrapper';
import usePermission from '../../hooks/usePermission';
import { fetchClassById } from '../../redux/actions/classActions';
import { clearCurrentClass } from '../../redux/slices/classSlice';
import { createSections, deleteSection, fetchSectionsByClass, reassignClassTeacher, updateSection } from '../../redux/actions/sectionActions';
import { clearSections } from '../../redux/slices/sectionSlice';
import { fetchTeachers } from '../../redux/actions/teacherActions';
import { fetchStudents } from '../../redux/actions/studentActions';
import { clearStudents } from '../../redux/slices/studentSlice';
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
  const students = useSelector((state) => state.students.list);
  const role = useSelector((state) => state.auth.user?.role);
  const { isAdmin, canManageStudentsIn, canManageSubjectsIn } = usePermission();
  const [sectionModal, setSectionModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [reassignSection, setReassignSection] = useState(null);
  const [deleteSectionItem, setDeleteSectionItem] = useState(null);

  // Reset state on mount/unmount so the previous class's data doesn't flash
  useEffect(() => {
    dispatch(clearCurrentClass());
    dispatch(clearSections());
    dispatch(clearStudents());
    dispatch(fetchClassById(id));
    dispatch(fetchSectionsByClass(id));
    if (role === 'admin') dispatch(fetchTeachers());
    return () => {
      dispatch(clearCurrentClass());
      dispatch(clearSections());
      dispatch(clearStudents());
    };
  }, [dispatch, id, role]);

  // Once we know the class, fetch its students (by classId — backend resolves all sections)
  useEffect(() => {
    if (current?._id === id) {
      dispatch(fetchStudents({ classId: id }));
    }
  }, [dispatch, current, id]);

  const teacherOptions = useMemo(() => buildOptions(teachers), [teachers]);

  const sectionInitialValues = useMemo(() => {
    if (!editingSection) return null;
    return [{
      name: editingSection.name,
      classTeacherId: editingSection.classTeacherId?._id?.toString() || editingSection.classTeacherId || '',
      roomNumber: editingSection.roomNumber || '',
    }];
  }, [editingSection]);

  if (loading && !current) return <Loader label="Loading class details..." />;

  const subjects = current?.subjects || [];

  return (
    <PageWrapper>
      <PageHeader
        backTo="/classes"
        backLabel="Back to Classes"
        title={current?.name ? `Class ${current.name}` : 'Class Detail'}
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
          <div><p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Class Teacher</p><p className="mt-2 font-semibold text-on-surface">{current?.hasSections ? 'See section assignments' : current?.classTeacherId?.name || 'Unassigned'}</p></div>
          <div><p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Students</p><p className="mt-2 font-semibold text-on-surface">{current?.studentCount || 0}</p></div>
        </div>
      </section>

      {current?.hasSections ? (
        <section className="glass-panel p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-on-surface">Sections</h2>
            {role === 'admin' ? <button type="button" onClick={() => setSectionModal(true)} className="btn-primary inline-flex items-center gap-2"><PlusCircle className="h-4 w-4" /> Add Section</button> : null}
          </div>
          {sections.length === 0 ? (
            <EmptyState title="No sections" message="No sections have been added to this class yet." />
          ) : (
            <SectionList
              sections={sections}
              canManage={role === 'admin'}
              onEdit={(section) => { setEditingSection(section); setSectionModal(true); }}
              onDelete={(section) => setDeleteSectionItem(section)}
              onReassign={(section) => setReassignSection(section)}
            />
          )}
        </section>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="glass-panel p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-on-surface">Students</h2>
            {isAdmin || sections.some((section) => canManageStudentsIn(section._id)) ? (
              <button type="button" onClick={() => navigate(`/students/new?classId=${id}`)} className="text-sm font-semibold text-primary">Add Student</button>
            ) : null}
          </div>
          {students.length === 0 ? (
            <p className="text-sm text-on-surface-variant">No students enrolled in this class yet.</p>
          ) : (
            <div className="space-y-3">
              {students.slice(0, 6).map((student) => (
                <button key={student._id} type="button" onClick={() => navigate(`/students/${student._id}`)} className="w-full rounded-glass-sm bg-white/50 p-4 text-left transition hover:bg-white/70">
                  <p className="font-semibold text-on-surface">{student.name}</p>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    Roll {student.rollNumber}
                    {student.sectionId?.name && student.sectionId.name !== 'Default' ? ` · Section ${student.sectionId.name}` : ''}
                  </p>
                </button>
              ))}
              {students.length > 6 ? (
                <button
                  type="button"
                  onClick={() => navigate(`/students?classId=${id}`)}
                  className="w-full text-sm font-semibold text-primary"
                >
                  View all {students.length} students
                </button>
              ) : null}
            </div>
          )}
        </section>

        <section className="glass-panel p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-on-surface">Subjects</h2>
            {isAdmin || sections.some((section) => canManageSubjectsIn(section._id)) ? (
              <button type="button" onClick={() => navigate(`/subjects/new?classId=${id}`)} className="text-sm font-semibold text-primary">Add Subject</button>
            ) : null}
          </div>
          {subjects.length === 0 ? (
            <p className="text-sm text-on-surface-variant">No subjects configured for this class yet.</p>
          ) : (
            <div className="space-y-3">
              {subjects.slice(0, 6).map((subject) => (
                <button key={subject._id} type="button" onClick={() => navigate(`/subjects/${subject._id}/edit`)} className="w-full rounded-glass-sm bg-white/50 p-4 text-left transition hover:bg-white/70">
                  <p className="font-semibold text-on-surface">{subject.name}</p>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    {subject.sectionId?.name && subject.sectionId.name !== 'Default' ? `Section ${subject.sectionId.name} · ` : ''}
                    {subject.subjectTeacherId?.name || 'Unassigned'}
                  </p>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      <SectionForm
        isOpen={sectionModal}
        title={editingSection ? 'Edit Section' : 'Add Section'}
        teachers={teacherOptions}
        initialValues={sectionInitialValues}
        onClose={() => { setSectionModal(false); setEditingSection(null); }}
        onSubmit={async (values) => {
          const sectionData = values.sections[0];
          const result = editingSection
            ? await dispatch(updateSection({ id: editingSection._id, ...sectionData }))
            : await dispatch(createSections({ classId: id, sections: values.sections }));
          if (!result.error) {
            setSectionModal(false);
            setEditingSection(null);
            dispatch(fetchClassById(id));
            dispatch(fetchSectionsByClass(id));
          }
        }}
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
