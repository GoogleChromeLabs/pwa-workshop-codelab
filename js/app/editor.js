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

import { EditorState, basicSetup } from '@codemirror/basic-setup';
import { EditorView, keymap } from '@codemirror/view';
import { defaultTabBinding } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';

export class Editor {
  constructor(parent) {
    this._update = [];
    this._parent = parent;

    const $ = this;

    this._editor = new EditorView({
      state: EditorState.create({
        extensions: [basicSetup, keymap.of([defaultTabBinding]), markdown(), oneDark],
      }),
      parent,
      dispatch(tr) {
        this.update([tr]);
        if ($._update.length && !tr.changes.empty) {
          for (const cb of $._update) {
            cb(this.state.doc.toString());
          }
        }
      },
      lineWrapping: true,
    });
  }

  setTheme(mode) {
    const $ = this;

    const extensions = [basicSetup, keymap.of([defaultTabBinding]), markdown()];

    if (mode === 'night') {
      extensions.push(oneDark);
    }

    const content = this._editor.state.doc.toString();
    this._editor.dom.remove();

    this._editor = new EditorView({
      state: EditorState.create({ extensions }),
      parent: this._parent,
      dispatch(tr) {
        this.update([tr]);
        if ($._update.length && !tr.changes.empty) {
          for (const cb of $._update) {
            cb(this.state.doc.toString());
          }
        }
      },
      lineWrapping: true,
    });

    this.setContent(content);
  }

  setContent(content) {
    this._editor.dispatch({
      changes: {
        from: 0,
        to: this._editor.state.doc.toString().length,
        insert: content,
      },
    });
  }

  content() {
    return this._editor.state.doc.toString();
  }

  onUpdate(fn) {
    this._update = this._update.concat([fn]);
  }
}
