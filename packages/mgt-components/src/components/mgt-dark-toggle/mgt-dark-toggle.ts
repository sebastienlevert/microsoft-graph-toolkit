import { html, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { customElement, MgtBaseComponent } from '@microsoft/mgt-element';
import { fluentSwitch } from '@fluentui/web-components/dist/esm/switch';
import { registerFluentComponents } from '../../utils/FluentComponents';
import { applyTheme } from '../../styles/theme-manager';
import { strings } from './strings';

registerFluentComponents(fluentSwitch);

/**
 * Toggle to switch between light and dark mode
 * Will detect browser preference and set accordingly or dark mode can be forced
 *
 * @fires {CustomEvent<boolean>} darkmodechanged - Fired when dark mode is toggled by a user action
 *
 * @class MgtDarkToggle
 * @extends {MgtBaseComponent}
 */
@customElement('dark-toggle')
class MgtDarkToggle extends MgtBaseComponent {
  constructor() {
    super();
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme:dark)').matches;
    this.darkModeActive = prefersDarkMode;
    this.applyTheme(this.darkModeActive);
  }
  /**
   * Provides strings for localization
   *
   * @readonly
   * @protected
   * @memberof MgtDarkToggle
   */
  protected get strings() {
    return strings;
  }

  /**
   * Controls whether dark mode is active
   *
   * @type {boolean}
   * @memberof MgtDarkToggle
   */
  @property({
    attribute: 'mode',
    reflect: true,
    type: String,
    converter: {
      fromAttribute(value: string) {
        return value === 'dark';
      },
      toAttribute(value: boolean) {
        return value ? 'dark' : 'light';
      }
    }
  })
  public darkModeActive: boolean;

  /**
   * Fires after a component is updated.
   * Allows a component to trigger side effects after updating.
   *
   * @param {Map<string, any>} changedProperties
   * @memberof MgtDarkToggle
   */
  updated(changedProperties: Map<string, any>): void {
    if (changedProperties.has('darkModeActive')) {
      this.applyTheme(this.darkModeActive);
    }
  }

  /**
   * renders the component
   *
   * @return {TemplateResult}
   * @memberof MgtDarkToggle
   */
  render(): TemplateResult {
    return html`
      <fluent-switch checked=${this.darkModeActive} @change=${this.onSwitchChanged}>
        <span slot="checked-message">${strings.on}</span>
        <span slot="unchecked-message">${strings.off}</span>
        <label for="direction-switch">${strings.label}</label>
      </fluent-switch>
`;
  }

  private onSwitchChanged(e: Event) {
    this.darkModeActive = (e.target as HTMLInputElement).checked;
    this.fireCustomEvent('darkmodechanged', this.darkModeActive);
  }

  private applyTheme(active: boolean) {
    const targetTheme = active ? 'dark' : 'light';
    applyTheme(targetTheme);

    document.body.classList.remove('mgt-dark-mode', 'mgt-light-mode');
    document.body.classList.add(`mgt-${targetTheme}-mode`);
  }
}
