import * as yup from 'yup';

import { requiredString } from './commonRules';

export const sectionSchema = yup.object({
  sections: yup.array().of(
    yup.object({
      name: requiredString('Section name'),
      classTeacherId: yup.string().required('Class teacher is required'),
      roomNumber: yup.string().nullable(),
    })
  ),
});
