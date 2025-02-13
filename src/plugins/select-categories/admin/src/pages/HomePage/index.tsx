import { useState } from 'react';
import { Check } from '@strapi/icons';
import { useFormik } from 'formik';

import { TextFieldsBox, Header, Page, SaveButton, Title, Box } from './StyledComponents';
import { TextField } from '../../components';
import SelectCategoriesAccordion from '../../components/SelectCategories';

const initialValues = {
  name: '',
  slug: '',
};

const HomePage = () => {
  const [tree, setTree] = useState([
    {
      id: '1',
      label: 'Category',
      checked: false,
      subcategories: [],
    },
  ]);

  console.log('tree', tree);

  const formik = useFormik({
    initialValues,
    onSubmit: () => {},
  });

  return (
    <Page>
      <Header>
        <Title>Select categories</Title>
        <SaveButton>
          <Check />
          Save
        </SaveButton>
      </Header>
      <TextFieldsBox>
        <TextField label="Name" name={'name'} formik={formik} />
        <TextField label="Slug" name={'slug'} formik={formik} />
      </TextFieldsBox>
      <SelectCategoriesAccordion passedTree={tree} setPassedTree={setTree} />
    </Page>
  );
};

export { HomePage };
