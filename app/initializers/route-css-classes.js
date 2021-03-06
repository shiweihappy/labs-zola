import Ember from 'ember';
import { inject as service } from '@ember/service';

export function initialize() {
  Ember.Route.reopen({
    fastboot: service(),
    activate(...args) {
      this._super(...args);

      // if-guard to prevent the node-based fastboot server from running this
      // because it relies on DOM methods
      if (!this.fastboot.isFastBoot) {
        const el = this.getBodyElement();
        const routeCssClass = this.getRouteCssClass();

        if (el.classList) {
          el.classList.add(routeCssClass);
        } else {
          el.className += ` ${routeCssClass}`;
        }
      }
    },

    deactivate(...args) {
      this._super(...args);

      // if-guard to prevent the node-based fastboot server from running this
      // because it relies on DOM methods
      if (!this.fastboot.isFastBoot) {
        const el = this.getBodyElement();
        const className = this.getRouteCssClass();

        if (el.classList) {
          el.classList.remove(className);
        } else {
          el.className = el.className.replace(new RegExp(`(^|\\b)${className.split(' ').join('|')}(\\b|$)`, 'gi'), ' ');
        }
      }
    },

    getRouteCssClass() {
      return `${this.get('routeName').replace(/\./g, '-').dasherize()}`;
    },

    getBodyElement() {
      return document.querySelector('body');
    },
  });
}

export default {
  initialize,
};
