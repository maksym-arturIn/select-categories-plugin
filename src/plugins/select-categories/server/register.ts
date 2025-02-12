'use strict';

module.exports = ({ strapi }) => {
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
