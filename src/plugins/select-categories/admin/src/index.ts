import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';
import { StrapiApp } from '@strapi/strapi/admin';

export default {
  register(app: StrapiApp) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: PLUGIN_ID,
      },
      permissions: [],
      Component: async () => {
        const component = await import('./pages/App');

        return component;
      },
    });

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });

    app.customFields.register({
      name: 'select-categories',
      pluginId: PLUGIN_ID,
      type: 'json',
      intlLabel: {
        id: `${PLUGIN_ID}.select-categories.label`,
        defaultMessage: 'Select Categories',
      },
      intlDescription: {
        id: `${PLUGIN_ID}.select-categories.description`,
        defaultMessage: 'A custom field for selecting categories',
      },
      components: {
        Input: async () => await import('./components/SelectCategories'),
      },
      options: {
        base: [
          {
            // @ts-ignore
            name: 'options.categoriesTree',
            // @ts-ignore
            type: 'json',
            intlLabel: {
              id: `${PLUGIN_ID}.select-categories.tree`,
              defaultMessage: 'Categories Tree',
            },
            description: {
              id: `${PLUGIN_ID}.select-categories.tree.description`,
              defaultMessage: 'Define a tree structure with categories and subcategories',
            },
          },
        ],
        advanced: [],
      },
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);

          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
