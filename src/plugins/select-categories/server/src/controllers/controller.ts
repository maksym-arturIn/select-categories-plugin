import type { Core } from '@strapi/strapi';
import { PLUGIN_ID } from '../../pluginId';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  index(ctx) {
    ctx.body = strapi.plugin(PLUGIN_ID).service('service').getWelcomeMessage();
  },
});

export default controller;
