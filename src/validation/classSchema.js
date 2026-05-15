import * as yup from 'yup';

import { requiredString } from './commonRules';

export const classSchema = yup.object({
  name: requiredString('Class name'),
  hasSections: yup.boolean().required(),
  classTeacherId: yup.string().when('hasSections', {
    is: false,
    then: (schema) => schema.required('Class teacher is required'),
    otherwise: (schema) => schema.nullable(),
  }),
  academicYear: yup.string().nullable(),
  roomNumber: yup.string().nullable(),
  notes: yup.string().nullable(),
});
