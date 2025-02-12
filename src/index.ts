// import type { Core } from '@strapi/strapi';

// a1aa1aa0bba3213ae4bfe985a7e457cb6bb4f0665c5e2ab724baa727ed42cd25513179d93f6aad3dd1875804ef1b184bf5fec8793742be428f22f5726aa653ae0900eac1b38a5e570be5497e3f09b4ae18d846e3091f2a7e75753b4f1a4123d8eef96de9188997fd62b34b2e57004cbd98a2b600d78620946ac2c8aa0aab805c

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};
