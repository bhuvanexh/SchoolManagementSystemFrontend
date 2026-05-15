import * as yup from 'yup';

import { dateRule, emailRule, phoneRule, rollNumberRule, requiredString } from './commonRules';

export const studentSchema = yup.object({
  name: requiredString('Student name'),
  rollNumber: rollNumberRule,
  dob: dateRule('date of birth'),
  parentName: requiredString('Parent name'),
  parentContact: phoneRule,
  sectionId: yup.string().required('Section is required'),
  email: emailRule,
  address: yup.string().nullable(),
  bloodGroup: yup.string().nullable(),
  notes: yup.string().nullable(),
});
