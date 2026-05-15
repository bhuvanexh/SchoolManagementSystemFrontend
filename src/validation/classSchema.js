import * as yup from 'yup';

export const classSchema = yup.object({
  name: yup
    .number()
    .typeError('Class must be a number between 1 and 12')
    .min(1, 'Class must be between 1 and 12')
    .max(12, 'Class must be between 1 and 12')
    .required('Class number is required'),
  hasSections: yup.boolean().default(false),
  classTeacherId: yup.string().when('hasSections', {
    is: false,
    then: (schema) => schema.required('Please assign a class teacher'),
    otherwise: (schema) => schema.nullable(),
  }),
  academicYear: yup.string().nullable(),
  roomNumber: yup.string().nullable(),
  notes: yup.string().nullable(),
});
