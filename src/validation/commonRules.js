import * as yup from 'yup';

export const requiredString = (label) =>
  yup.string().trim().required(`${label} is required`);

export const emailRule = yup
  .string()
  .trim()
  .email('Enter a valid email')
  .nullable()
  .transform((value) => (value === '' ? null : value));

export const requiredEmailRule = yup
  .string()
  .trim()
  .email('Enter a valid email')
  .required('Email is required');

export const phoneRule = yup
  .string()
  .trim()
  .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit phone number')
  .required('Phone number is required');

export const rollNumberRule = yup.string().trim().required('Roll number is required');

export const dateRule = (label) =>
  yup.date().typeError(`Enter a valid ${label}`).required(`${label} is required`);
