export interface IStrapiPayload<T = any> {
  data: T[];
}

export interface ICategoryTree {
  id?: string;
  title: string;
  slug: string;
  data: ICategory[];
}

export interface ICategory {
  id: string;
  title: string;
  slug: string;
  subcategories: ICategory[];
}

export interface ISelectCategoriesProps {
  name: string;
  onChange: (params: { target: { name: string; value: any[] } }) => void;
  value?: any[];
  disabled?: boolean;
  error?: string;
  required?: boolean;
}
