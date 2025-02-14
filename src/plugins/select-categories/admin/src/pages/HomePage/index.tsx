import { useEffect, useState } from 'react';
import { Check } from '@strapi/icons';
import { useFormik } from 'formik';
import { useFetchClient } from '@strapi/strapi/admin';
import { TextFieldsBox, Header, Page, SaveButton, Title } from './StyledComponents';
import { TextField, CategoriesAccordion, CategoryNode } from '../../components';
import { PLUGIN_ID } from '../../pluginId';

const initialValues = {
  name: '',
  slug: '',
};

const HomePage = () => {
  const client = useFetchClient();
  const [tree, setTree] = useState<CategoryNode[]>([
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

  const getCategoryTree = async () => {
    const categoryTree = await client.get(`${PLUGIN_ID}/category-trees`);
    // const categoryTree = await client.post(`${PLUGIN_ID}/category-trees/${id}`, {
    //   // New object
    // });
    // const categoryTree = await client.put(`${PLUGIN_ID}/category-trees`, {
    //   // Updated object
    // });
    // const categoryTree = await client.del(`${PLUGIN_ID}/category-trees/${id}`);
    console.log('categoryTree', categoryTree);
  };

  useEffect(() => {
    getCategoryTree();
  }, []);

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
