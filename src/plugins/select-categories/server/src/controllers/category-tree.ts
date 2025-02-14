import type { Context } from 'koa';

export default ({ strapi }) => ({
  async find(ctx: Context) {
    try {
      const categoryTrees = await strapi
        .plugin('select-categories')
        .service('categoryTree')
        .find(ctx.query);
      return categoryTrees;
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async findOne(ctx: Context) {
    try {
      const { id } = ctx.params;
      const categoryTree = await strapi
        .plugin('select-categories')
        .service('categoryTree')
        .findOne(id);
      return categoryTree;
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async create(ctx: Context) {
    try {
      const categoryTree = await strapi
        .plugin('select-categories')
        .service('categoryTree')
        .create(ctx.request.body);
      return categoryTree;
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async update(ctx: Context) {
    try {
      const { id } = ctx.params;
      const categoryTree = await strapi
        .plugin('select-categories')
        .service('categoryTree')
        .update(id, ctx.request.body);
      return categoryTree;
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async delete(ctx: Context) {
    try {
      const { id } = ctx.params;
      const categoryTree = await strapi
        .plugin('select-categories')
        .service('categoryTree')
        .delete(id);
      return categoryTree;
    } catch (err) {
      ctx.throw(500, err);
    }
  },
});
