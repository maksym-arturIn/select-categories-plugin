'use strict';
import { PLUGIN_ID } from './pluginId';

module.exports = ({ strapi }) => {
  strapi.customFields.register({
    name: PLUGIN_ID,
    plugin: PLUGIN_ID,
    type: 'json',
  });
};
