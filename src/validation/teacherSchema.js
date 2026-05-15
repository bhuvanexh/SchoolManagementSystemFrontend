import * as yup from 'yup';

import { requiredEmailRule, phoneRule, requiredString } from './commonRules';

export const teacherSchema = yup.object({
  name: requiredString('Full name'),
  email: requiredEmailRule,
  phone: phoneRule,
  coreSubjects: yup
    .array()
    .min(1, 'Select at least one core subject')
    .required('Please select at least one core subject'),
  qualification: yup.string().nullable(),
  experience: yup.string().nullable(),
  address: yup.string().nullable(),
  notes: yup.string().nullable(),
});
