import { useState } from 'react';
import { Check } from '@strapi/icons';
import { useFormik } from 'formik';

import { TextFieldsBox, Header, Page, SaveButton, Title, Box } from './StyledComponents';
import { TextField, CategoriesAccordion } from '../../components';

const initialValues = {
  name: '',
  slug: '',
};

const HomePage = () => {
  const [tree, setTree] = useState([
    {
      id: '1',
      name: 'Category',
      slug: 'Slug Category',
      checked: false,
      subcategories: [],
    },
  ]);

  console.log('tree', tree);

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      console.log({
        ...values,
        tree,
      });
    },
  });

  return (
    <Page>
      <Header>
        <Title>Select categories</Title>
        <SaveButton type="submit" onClick={formik.handleSubmit}>
          <Check />
          Save
        </SaveButton>
      </Header>
      <TextFieldsBox>
        <TextField label="Name" name={'name'} formik={formik} />
        <TextField label="Slug" name={'slug'} formik={formik} />
      </TextFieldsBox>
      <CategoriesAccordion passedTree={tree} setPassedTree={setTree} />
    </Page>
  );
};

export { HomePage };
