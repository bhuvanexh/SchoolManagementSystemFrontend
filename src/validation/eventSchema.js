import * as yup from 'yup';

import { requiredString } from './commonRules';

export const eventSchema = yup.object({
  title: requiredString('Event title'),
  dateTime: yup
    .date()
    .typeError('Enter a valid date and time')
    .min(new Date(), 'Event date must be in the future')
    .required('Date and time is required'),
  visibility: yup
    .string()
    .oneOf(['school', 'class', 'section'], 'Please select a valid visibility option')
    .required('Visibility is required'),
  targetId: yup.string().when('visibility', {
    is: (value) => value !== 'school',
    then: (schema) => schema.required('Please select a target class or section'),
    otherwise: (schema) => schema.nullable(),
  }),
  description: yup.string().nullable(),
  location: yup.string().nullable(),
  organizer: yup.string().nullable(),
});
