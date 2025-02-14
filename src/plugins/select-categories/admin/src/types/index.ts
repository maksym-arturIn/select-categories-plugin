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
