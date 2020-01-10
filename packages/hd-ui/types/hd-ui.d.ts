import Vue from 'vue'
import { HdUIComponent } from './component'

import { HdHello } from './hello'

export interface InstallationOptions {
  locale: any,
  i18n: any,
  size: string
}

/** The version of element-ui */
export const version: string

/**
 * Install all hd-ui components into Vue.
 * Please do not invoke this method directly.
 * Call `Vue.use(HdUI)` to install.
 */
export function install (vue: typeof Vue, options: InstallationOptions): void

/** ElementUI component common definition */
export type Component = HdUIComponent

// TS cannot merge imported class with namespace, so declare subclasses instead

/** Hello Component */
export class Hello extends HdHello {}
