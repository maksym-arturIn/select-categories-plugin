interface CategoryTree {
  id: number;
  title: string;
  slug: string;
  data: any[];
}

interface CategoryTreeData {
  title: string;
  slug: string;
  data: any[];
}

export default ({ strapi }) => ({
  async find(query: any): Promise<CategoryTree[]> {
    return await strapi.entityService.findMany('plugin::select-categories.category-tree', query);
  },

  async findOne(id: number): Promise<CategoryTree | null> {
    return await strapi.entityService.findOne('plugin::select-categories.category-tree', id);
  },

  async create(data: CategoryTreeData): Promise<CategoryTree> {
    return await strapi.entityService.create('plugin::select-categories.category-tree', {
      data,
    });
  },

  async update(id: number, data: Partial<CategoryTreeData>): Promise<CategoryTree> {
    return await strapi.entityService.update('plugin::select-categories.category-tree', id, {
      data,
    });
  },

  async delete(id: number): Promise<CategoryTree> {
    return await strapi.entityService.delete('plugin::select-categories.category-tree', id);
  },
});
