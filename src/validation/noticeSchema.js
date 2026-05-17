import * as yup from 'yup';

import { requiredString } from './commonRules';

export const noticeSchema = yup.object({
  title: requiredString('Title'),
  content: requiredString('Content'),
  visibility: yup
    .string()
    .oneOf(['school', 'teachers', 'class', 'section'], 'Please select a valid visibility option')
    .required('Visibility is required'),
  targetId: yup.string().when('visibility', {
    is: (value) => value === 'class' || value === 'section',
    then: (schema) => schema.required('Please select a target class or section'),
    otherwise: (schema) => schema.nullable(),
  }),
  expiresAt: yup.string().nullable(),
  isPriority: yup.boolean(),
});
