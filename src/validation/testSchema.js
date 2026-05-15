import * as yup from 'yup';

import { dateRule, requiredString } from './commonRules';

export const testSchema = yup.object({
  name: requiredString('Test name'),
  subjectId: yup.string().required('Please select a subject'),
  testDate: dateRule('test date'),
  maxScore: yup
    .number()
    .typeError('Maximum score must be a number')
    .min(1, 'Score must be at least 1')
    .required('Maximum score is required'),
});
