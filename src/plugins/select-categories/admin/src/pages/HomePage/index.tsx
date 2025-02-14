import { useEffect, useState } from 'react';
import { Check } from '@strapi/icons';
import { useFormik } from 'formik';
import { useFetchClient } from '@strapi/strapi/admin';
import { TextFieldsBox, Header, Page, SaveButton, Title } from './StyledComponents';
import { TextField, CategoriesAccordion } from '../../components';
import { PLUGIN_ID } from '../../pluginId';
import type { IStrapiPayload, ICategoryTree, ICategory } from '../../types';

const initialValues: ICategoryTree = {
  title: '',
  slug: '',
  data: [],
};

const HomePage = () => {
  const client = useFetchClient();
  const [tree, setTree] = useState<ICategoryTree>();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...initialValues, ...tree },
    onSubmit: async ({ title, slug }: any = { title: '', slug: '' }) => {
      try {
        if (!tree?.id) {
          const { data } = await client.post(`${PLUGIN_ID}/category-trees`, {
            ...tree,
            title,
            slug,
          });

          console.log('POST data', data);
          setTree(data);
          return;
        }

        const { data: updatedData } = await client.put(`${PLUGIN_ID}/category-trees/${tree.id}`, {
          ...tree,
          title,
          slug,
        });

        console.log('PUT data', updatedData);

        setTree(updatedData);
        return;
      } catch (error) {
        console.error(error);
      }
    },
  });

  const getCategoryTree = async () => {
    const { data = [] } = await client.get<IStrapiPayload<ICategoryTree>>(
      `${PLUGIN_ID}/category-trees`
    );

    const [categoryTree] = data as ICategoryTree[];

    // const categoryTree = await client.post(`${PLUGIN_ID}/category-trees/${id}`, {
    //   // New object
    // });
    // const categoryTree = await client.put(`${PLUGIN_ID}/category-trees`, {
    //   // Updated object
    // });
    // const categoryTree = await client.del(`${PLUGIN_ID}/category-trees/${id}`);
    console.log('categoryTree', categoryTree);

    if (!categoryTree) {
      setTree(initialValues);
      return;
    }

    setTree(categoryTree);
  };

  useEffect(() => {
    getCategoryTree();
  }, []);

  useEffect(() => {
    if (tree) {
      console.log('tree', tree);
    }
  }, [tree]);

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
        <TextField label="Name" name={'title'} formik={formik} />
        <TextField label="Slug" name={'slug'} formik={formik} />
      </TextFieldsBox>

      <CategoriesAccordion passedTree={tree} setPassedTree={setTree} />
    </Page>
  );
};

export { HomePage };
