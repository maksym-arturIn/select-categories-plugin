import { ICategory } from 'src/types';

export const filterSelectedCategories = (
  categories: ICategory[],
  selected: string[]
): ICategory[] => {
  return categories
    .map((category) => {
      if (selected.includes(category.id)) {
        return {
          ...category,
          subcategories: filterSelectedCategories(category.subcategories, selected),
        };
      }

      const filteredSubcategories = filterSelectedCategories(category.subcategories, selected);
      if (filteredSubcategories.length > 0) {
        return { ...category, subcategories: filteredSubcategories };
      }

      return null;
    })
    .filter(Boolean) as ICategory[];
};

export const filterCategories = (categories: ICategory[], search: string): ICategory[] => {
  return categories
    .map((category) => {
      const filteredChildren = filterCategories(category.subcategories, search);

      if (
        category.title.toLowerCase().includes(search.toLowerCase()) ||
        filteredChildren.length > 0
      ) {
        return { ...category, subcategories: filteredChildren };
      }

      return null;
    })
    .filter(Boolean) as ICategory[];
};

export const getAllSubcategoryIds = (category: ICategory) => {
  let ids = [category.id];
  category.subcategories.forEach((sub) => {
    ids = ids.concat(getAllSubcategoryIds(sub));
  });
  return ids;
};

export const checkEmptyFields = (categories: ICategory[]): boolean => {
  return categories.some(
    (category) =>
      !category.title.trim() || !category.slug.trim() || checkEmptyFields(category.subcategories)
  );
};
