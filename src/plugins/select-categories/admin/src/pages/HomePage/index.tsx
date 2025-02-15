import { useEffect, useState } from 'react';
import { Check } from '@strapi/icons';
import { useFormik } from 'formik';
import { useFetchClient } from '@strapi/strapi/admin';
import { TextFieldsBox, Header, Page, SaveButton, Title } from './StyledComponents';
import { TextField, CategoriesAccordion } from '../../components';
import { PLUGIN_ID } from '../../pluginId';
import type { IStrapiPayload, ICategoryTree } from '../../types';
import { useNotification } from '@strapi/strapi/admin';
import { dequal } from 'dequal';

const initialValues: ICategoryTree = {
  title: '',
  slug: '',
  data: [],
};

const HomePage = () => {
  const client = useFetchClient();
  const [tree, setTree] = useState<ICategoryTree>(initialValues);
  const [initializeValues, setInitializeValues] = useState(initialValues);
  const { toggleNotification } = useNotification();

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
          setInitializeValues(data);

          toggleNotification({
            type: 'success',
            message: 'Success update',
          });
          return;
        }

        const { data: updatedData } = await client.put(`${PLUGIN_ID}/category-trees/${tree.id}`, {
          ...tree,
          title,
          slug,
        });

        console.log('PUT data', updatedData);

        toggleNotification({
          type: 'success',
          message: 'Success update',
        });

        setTree(updatedData);
        setInitializeValues(updatedData);
        return;
      } catch (error: any) {
        toggleNotification({
          type: 'danger',
          message: error.message,
        });
        console.error(error);
      }
    },
  });

  const getCategoryTree = async () => {
    const { data = [] } = await client.get<IStrapiPayload<ICategoryTree>>(
      `${PLUGIN_ID}/category-trees`
    );

    const [categoryTree] = data as ICategoryTree[];

    if (!categoryTree) {
      setTree(initialValues);
      setInitializeValues(initialValues);
      return;
    }

    setInitializeValues(categoryTree);
    setTree(categoryTree);
  };

  useEffect(() => {
    getCategoryTree();
  }, []);

  const disabled = dequal(
    { data: initializeValues.data, title: formik.values['title'], slug: formik.values['slug'] },
    { data: tree.data, title: tree.title, slug: tree.slug }
  );

  return (
    <Page>
      <Header>
        <Title>Select categories</Title>
        <SaveButton disabled={disabled} type="submit" onClick={formik.handleSubmit}>
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
