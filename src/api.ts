export default class Loader {
  baseLink = 'mc.us-central1.gcp.commercetools.com';
  options = {};

  constructor(baseLink?: string, options?: Record<string, string>) {
    if (baseLink) {
      this.baseLink = baseLink;
    }
    if (options) {
      this.options = options;
    }
  }
}
