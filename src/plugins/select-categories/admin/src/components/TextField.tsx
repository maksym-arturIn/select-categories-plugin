import { FC } from 'react';
import { FormikValues } from 'formik';
import { TextInput } from '@strapi/design-system';
import { Field } from '@strapi/design-system';

type Props = {
  name: string;
  formik: FormikValues;
  label?: string;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const TextField: FC<Props> = ({ formik, name, label, ...props }) => {
  const errorMessage = formik.errors[name];
  const isError = errorMessage && formik.touched[name];

  return (
    <Field.Root id={name} hint={errorMessage} style={{ width: '100%' }}>
      {label && <Field.Label>{label}</Field.Label>}
      <TextInput
        name={name}
        id={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        error={isError}
        {...props}
      />
      <Field.Error />
      <Field.Hint />
    </Field.Root>
  );
};
