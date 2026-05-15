import * as yup from 'yup';

import { requiredString } from './commonRules';

export const eventSchema = yup.object({
  title: requiredString('Event title'),
  dateTime: yup
    .date()
    .typeError('Enter a valid date and time')
    .min(new Date(), 'Event must be in the future')
    .required('Date and time is required'),
  visibility: yup.string().oneOf(['school', 'class', 'section']).required('Visibility is required'),
  targetId: yup.string().when('visibility', {
    is: (value) => value !== 'school',
    then: (schema) => schema.required('Target is required'),
    otherwise: (schema) => schema.nullable(),
  }),
  description: yup.string().nullable(),
  location: yup.string().nullable(),
  organizer: yup.string().nullable(),
});
