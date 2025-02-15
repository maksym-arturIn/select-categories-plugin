import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';
import type { StrapiApp } from '@strapi/strapi/admin';
import { getTranslation } from './utils/getTranslation';

export default {
  register(app: StrapiApp) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: getTranslation('name'),
        defaultMessage: PLUGIN_ID,
      },
      permissions: [],
      Component: () => import('./pages/App'),
    });

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });

    app.customFields.register({
      name: PLUGIN_ID,
      pluginId: PLUGIN_ID,
      type: 'json',
      intlLabel: {
        id: getTranslation('label'),
        defaultMessage: 'Select Categories',
      },
      intlDescription: {
        id: getTranslation('description'),
        defaultMessage: 'A custom field for selecting categories',
      },
      components: {
        // @ts-ignore
        Input: () => import('./components/SelectCategories'),
      },
      options: {
        base: [
          {
            name: 'default',
            // @ts-ignore
            type: 'json',
            intlLabel: {
              id: getTranslation('tree.label'),
              defaultMessage: 'Categories Tree',
            },
            description: {
              id: getTranslation('tree.description'),
              defaultMessage: 'Define a tree structure with categories and subcategories',
            },
          },
        ],
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
