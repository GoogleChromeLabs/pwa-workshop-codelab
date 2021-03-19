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

import { Actions } from '../lib/actions.js';

export class Menu extends Actions {
  /**
   * Set up Actions
   * @param {DOMElement} parent
   */
  constructor(parent, editor) {
    super();
    // Get toggle button and menu
    this._toggle = parent.querySelector('.actions--toggle');
    this._menu = parent.querySelector('.actions--menu');

    // Set up menu open/close and tabs
    this._toggle.addEventListener('click', this._toggleMenu.bind(this));
    parent.addEventListener('keydown', this._captureTab.bind(this), { bubble: false });
    document.body.addEventListener('keydown', this._triggerActions.bind(this));

    // Get all buttons and set up button actions
    this._buttons = [...this._menu.querySelectorAll('.actions--action')];

    this.editor = editor;

    for (const button of this._buttons) {
      const id = button.id;
      button.addEventListener('click', this[id].bind(this));
    }
  }

  /**
   * Toggles relevant ARIA attributes to hide/show the actions menu
   */
  _toggleMenu() {
    if (this._menu.ariaHidden === 'true') {
      // Show the menu if it's currently hidden
      this._menu.ariaHidden = false;
      this._toggle.ariaExpanded = true;
      this._toggle.ariaLabel = 'Close actions';
      for (const button of this._buttons) {
        button.tabIndex = 0;
      }
    } else {
      // Hide the menu if it's currently shown
      this._menu.ariaHidden = true;
      this._toggle.ariaExpanded = false;
      this._toggle.ariaLabel = 'Open actions';
      for (const button of this._buttons) {
        button.tabIndex = 1;
      }
    }
  }

  /**
   * Captures tabbing through the menu when it's open and allows the escape key to close the menu
   * @param {DOMEvent} e - Event
   */
  _captureTab(e) {
    if (this._menu.ariaHidden !== 'true') {
      const tab = e.key === 'Tab';
      const esc = e.key === 'Escape';
      const shift = e.shiftKey;
      const target = e.target;

      if (target === this._buttons[this._buttons.length - 1] && tab && !shift) {
        e.preventDefault();
        this._toggle.focus();
      } else if (target === this._toggle && tab && shift) {
        e.preventDefault();
        this._buttons[this._buttons.length - 1].focus();
      } else if (esc) {
        this._toggle.focus();
        this._toggleMenu();
      }
    }
  }

  /**
   * Trigger menu actions based on keyboard shortcuts
   * @param {DOMEvent} e - Keyboard Event
   */
  _triggerActions(e) {
    if (e.metaKey) {
      switch (e.code) {
        // Save/Save As
        case 'KeyS':
          e.preventDefault();
          // Meta + Shift + S
          // Save As
          if (e.shiftKey) {
            this.saveAs();
          } else {
            // Meta + S
            // Save
            this.save();
          }
          break;
        // Open
        case 'KeyO':
          e.preventDefault();
          // Meta + O
          this.open();
          break;
        // Focus
        case 'KeyF':
          if (e.shiftKey) {
            e.preventDefault();
            // Meta + Shift + F
            this.focus();
          }
          break;
        // Preview
        case 'KeyP':
          if (e.shiftKey) {
            e.preventDefault();
            // Meta + Shift + P
            this.preview();
          }
          break;
        // Preview
        case 'KeyR':
          if (e.shiftKey) {
            e.preventDefault();
            // Meta + Shift + R
            this.reset();
          }
          break;
      }
    }
  }
}
