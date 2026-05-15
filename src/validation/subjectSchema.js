import * as yup from 'yup';

import { requiredString } from './commonRules';

export const subjectSchema = yup.object({
  name: requiredString('Subject name'),
  coreSubjectId: yup.string().required('Core subject is required'),
  classId: yup.string().required('Class is required'),
  sectionId: yup.string().required('Section is required'),
  subjectTeacherId: yup.string().required('Subject teacher is required'),
  periodsPerWeek: yup.number().min(1).max(15).required('Periods per week is required'),
  subjectCode: yup.string().nullable(),
  description: yup.string().nullable(),
});
