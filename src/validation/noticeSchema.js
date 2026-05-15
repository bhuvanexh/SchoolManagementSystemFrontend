import * as yup from 'yup';

import { requiredString } from './commonRules';

export const noticeSchema = yup.object({
  title: requiredString('Title'),
  content: requiredString('Content'),
  visibility: yup.string().oneOf(['school', 'class', 'section']).required('Visibility is required'),
  targetId: yup.string().when('visibility', {
    is: (value) => value !== 'school',
    then: (schema) => schema.required('Target is required'),
    otherwise: (schema) => schema.nullable(),
  }),
  expiresAt: yup.string().nullable(),
  isPriority: yup.boolean(),
});
