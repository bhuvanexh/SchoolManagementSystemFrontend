import * as yup from 'yup';

export const attendanceSchema = yup.object({
  sectionId: yup.string().required('Section is required'),
  date: yup.string().required('Date is required'),
});
