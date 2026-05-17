import { useMemo } from 'react';
import { useSelector } from 'react-redux';

const normalizeId = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value._id || value.id || value.sectionId || value.classId || value.subjectId || '';
};

const usePermission = () => {
  const { user, profile } = useSelector((state) => state.auth);
  const role = user?.role;
  const isAdmin = role === 'admin';
  const isTeacher = role === 'teacher';

  const permissionState = useMemo(() => {
    const classTeacherSectionIds = new Set(profile?.classTeacherSectionIds || []);
    const classTeacherClassIds = new Set([
      ...(profile?.classTeacherClassIds || []),
      ...((profile?.classTeacherSections || []).map((item) => normalizeId(item.classId))),
      ...((profile?.classTeacherClasses || []).map((item) => normalizeId(item.classId))),
    ].filter(Boolean));
    const subjectTeacherSubjectIds = new Set(profile?.subjectTeacherSubjectIds || []);

    const isCreator = (entity) => {
      const createdById = normalizeId(entity?.createdBy);
      return Boolean(createdById) && createdById === user?._id;
    };

    const isClassTeacherOf = (sectionId) => isAdmin || classTeacherSectionIds.has(normalizeId(sectionId));
    const isClassTeacherOfClass = (classId) => isAdmin || classTeacherClassIds.has(normalizeId(classId));
    const isSubjectTeacherOf = (subjectId) => isAdmin || subjectTeacherSubjectIds.has(normalizeId(subjectId));
    const canManageNotice = (entity) => isAdmin || isCreator(entity);
    const canManageStudentsIn = (sectionId) => isAdmin || isClassTeacherOf(sectionId);
    const canManageSubjectsIn = (sectionId) => isAdmin || isClassTeacherOf(sectionId);
    // Class teachers can manage students/subjects in their sections.
    const canCreateScopedContent = isAdmin || classTeacherSectionIds.size > 0 || classTeacherClassIds.size > 0;
    // Notices/events: any teacher (class teacher OR subject teacher) can target their teaching scope.
    const canCreateNoticeOrEvent = isAdmin || classTeacherSectionIds.size > 0 || classTeacherClassIds.size > 0 || subjectTeacherSubjectIds.size > 0;

    return {
      isAdmin,
      isTeacher,
      role,
      isCreator,
      isClassTeacherOf,
      isClassTeacherOfClass,
      isSubjectTeacherOf,
      canManageNotice,
      canManageStudentsIn,
      canManageSubjectsIn,
      canCreateScopedContent,
      canCreateNoticeOrEvent,
    };
  }, [isAdmin, isTeacher, profile, role, user?._id]);

  return permissionState;
};

export default usePermission;
