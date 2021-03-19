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

import { openDB } from 'idb';

export class Actions {
  constructor() {
    this.db = null;

    // Get the database and current open file handler
    openDB('settings-store').then(async (db) => {
      this.db = db;
      const file = await db.get('settings', 'handler');

      if (file) {
        document.title = `${file.name} | PWA Edit`;
        this.handler = file;
      }
    });

    // Get launched files
    if ('launchQueue' in window) {
      launchQueue.setConsumer((params) => {
        if (!params.files.length) return;

        for (const handler of params.files) {
          this.open(handler);
        }
      });
    }

    // Close the preview window when this window closes
    window.addEventListener('beforeunload', () => {
      if (this.previewWindow) {
        this.previewWindow.close();
      }
    });
  }

  /**
   * Function to call when the open button is triggered
   */
  async open(launchHandler) {
    try {
      let handler;
      if (launchHandler instanceof FileSystemFileHandle) {
        handler = launchHandler;
      } else {
        [handler] = await window.showOpenFilePicker({
          types: [
            {
              description: 'Markdown files',
              accept: {
                'text/markdown': ['.md', '.markdown'],
              },
            },
          ],
        });
      }

      document.title = `${handler.name} | PWA Edit`;

      const file = await handler.getFile();
      const content = await file.text();

      this.handler = handler;
      this.editor.setContent(content);
      await this.db.put('settings', handler, 'handler');
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Function to call when the save button is triggered
   */
  async save() {
    const handler = this.handler || (await this.db.get('settings', 'handler'));

    if (!handler) {
      await this.saveAs();
    } else {
      try {
        const writable = await handler.createWritable();
        await writable.write(this.editor.content());
        await writable.close();
      } catch (e) {
        console.error(e);
      }
    }
  }

  /**
   * Function to call when the duplicate/save as button is triggered
   */
  async saveAs() {
    try {
      const handler = await window.showSaveFilePicker({
        types: [
          {
            description: 'Markdown file',
            accept: {
              'text/markdown': ['.md'],
            },
          },
        ],
      });

      this.handler = handler;
      await this.db.put('settings', handler, 'handler');
      await this.save();
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Reset the editor and file handler
   */
  async reset() {
    this.editor.setContent('');
    this.handler = null;
    document.title = 'PWA Edit';
    await this.db.delete('settings', 'handler');
  }

  /**
   * Function to call when the preview button is triggered
   */
  async preview() {
    if (this.previewWindow) {
      this.previewWindow.close();
      this.previewWindow = null;
      return;
    }

    const options = 'menubar=0,toolbar=0,status=0,location=0';
    const { screens } = await window.getScreens();

    // Find the primary screen
    const screen = screens.find((s) => s.isPrimary);

    // Get it's available width
    const width = screen.availWidth / 2;

    // Build a window from the information
    this.previewWindow = window.open('/preview', 'Markdown preview', `${options},left=${width},top=${screen.availTop},height=${screen.availHeight},width=${width}`);
  }

  /**
   * Function to call when the focus button is triggered
   */
  async focus() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      if (this.wakeLock) {
        this.wakeLock.release();
        this.wakeLock = null;
      }
    } else {
      if ('wakeLock' in navigator) {
        this.wakeLock = await navigator.wakeLock.request();
      }
      await document.body.requestFullscreen();
    }
  }
}
