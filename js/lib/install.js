/*
 Copyright 2021 Google LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

export class Install {
  /**
   *
   * @param {DOMElement} trigger - Triggering element
   */
  constructor(trigger) {
    this._prompt;
    this._trigger = trigger;

    // Capture install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this._prompt = e;
      this.toggleInstallButton('show');
    });

    // Trigger install prompt
    this._trigger.addEventListener('click', this.triggerInstall.bind(this));

    // Hide install prompt on install
    window.addEventListener('appinstalled', () => {
      this._prompt = null;
      this.toggleInstallButton('hide');
    });
  }

  /**
   * Toggle visibility of install button
   * @param {string} action
   */
  toggleInstallButton(action = 'hide') {
    if (action === 'hide') {
      this._trigger.style.display = 'none';
    } else {
      this._trigger.style.display = 'block';
    }
  }

  /**
   * Trigger PWA install prompt
   */
  async triggerInstall() {
    this._prompt.prompt();
    const { outcome } = await this._prompt.userChoice;

    this._prompt = null;

    if (outcome === 'accepted') {
      this.toggleInstallButton('hide');
    }
  }
}
