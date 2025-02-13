import type { Core } from '@strapi/strapi';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.customFields.register({
    name: 'select-categories',
    plugin: 'select-categories',
    type: 'json',
  });
};

export default register;
