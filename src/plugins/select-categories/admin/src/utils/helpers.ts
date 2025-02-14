import { ICategory } from 'src/types';

export const flattenSelectedCategories = (
  categories: ICategory[],
  selected: string[]
): ICategory[] => {
  return categories.reduce<ICategory[]>((acc, category) => {
    const filteredSubcategories = flattenSelectedCategories(category.subcategories, selected);

    if (selected.includes(category.id) || filteredSubcategories.length > 0) {
      acc.push({ ...category, subcategories: [] });
    }

    return acc.concat(filteredSubcategories);
  }, []);
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
