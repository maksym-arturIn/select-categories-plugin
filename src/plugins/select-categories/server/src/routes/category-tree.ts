export default [
  {
    method: 'GET',
    path: '/category-trees',
    handler: 'categoryTree.find',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/category-trees/:id',
    handler: 'categoryTree.findOne',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'POST',
    path: '/category-trees',
    handler: 'categoryTree.create',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'PUT',
    path: '/category-trees/:id',
    handler: 'categoryTree.update',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'DELETE',
    path: '/category-trees/:id',
    handler: 'categoryTree.delete',
    config: {
      policies: [],
      auth: false,
    },
  },
];
