import type { Core } from '@strapi/strapi';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  // register phase
  strapi.customFields.register({
    name: 'select-categories',
    plugin: 'select-categories',
    type: 'json',
    inputSize: {
      default: 4,
      isResizable: true,
    },
  });
};

export default register;
