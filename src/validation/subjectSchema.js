import * as yup from 'yup';

import { requiredString } from './commonRules';

export const subjectSchema = yup.object({
  name: requiredString('Subject name'),
  coreSubjectId: yup.string().required('Please select a core subject'),
  classId: yup.string().required('Please select a class'),
  // sectionId is conditionally required — enforced in SubjectForm based on hasSections
  sectionId: yup.string().nullable().transform((v) => v || null),
  subjectTeacherId: yup.string().required('Please assign a subject teacher'),
  periodsPerWeek: yup
    .number()
    .typeError('Periods per week must be a number')
    .min(1, 'Must be at least 1 period per week')
    .max(15, 'Cannot exceed 15 periods per week')
    .required('Periods per week is required'),
  subjectCode: yup.string().nullable(),
  description: yup.string().nullable(),
});
