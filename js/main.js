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
import { wrap } from 'comlink';

// Need to use this WMR syntax to properly compile the service worker.
// If you compile your service worker in another way, you can use the URL to it
// directly in navigator.serviceWorker.register
import swURL from 'sw:../service-worker.js';

// Register the service worker
if ('serviceWorker' in navigator) {
  // Wait for the 'load' event to not block other work
  window.addEventListener('load', async () => {
    // Try to register the service worker.
    try {
      const reg = await navigator.serviceWorker.register(swURL);
      console.log('Service worker registered! 😎', reg);
    } catch (err) {
      console.log('😥 Service worker registration failed: ', err);
    }
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  // Set up the database
  const db = await openDB('settings-store', 1, {
    upgrade(db) {
      db.createObjectStore('settings');
    },
  });

  // Set up worker
  const worker = new SharedWorker('/js/worker.js', {
    type: 'module',
  });
  const compiler = wrap(worker.port);

  // Set up the editor
  const { Editor } = await import('./app/editor.js');
  const editor = new Editor(document.body);

  // Set up the menu
  const { Menu } = await import('./app/menu.js');
  new Menu(document.querySelector('.actions'), editor);

  // Save content to database on edit
  editor.onUpdate(async (content) => {
    await db.put('settings', content, 'content');
    await compiler.set(content);
  });

  // Set the initial state in the editor
  const defaultText = `# Welcome to PWA Edit!\n\nTo leave the editing area, press the \`esc\` key, then \`tab\` or \`shift+tab\`.`;

  editor.setContent((await db.get('settings', 'content')) || defaultText);

  // Set up night mode toggle
  const { NightMode } = await import('./app/night-mode.js');
  new NightMode(
    document.querySelector('#mode'),
    async (mode) => {
      editor.setTheme(mode);
      await db.put('settings', mode, 'night-mode');
    },
    await db.get('settings', 'night-mode'),
  );

  // Set up install prompt
  const { Install } = await import('./lib/install.js');
  new Install(document.querySelector('#install'));
});
