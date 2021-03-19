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

import { expose } from 'comlink';
import marked from 'marked';

class Compiler {
  state = {
    raw: '',
    compiled: '',
  };
  subscribers = [];

  async set(content) {
    this.state = {
      raw: content,
      compiled: marked(content),
    };

    await Promise.all(this.subscribers.map((s) => s(this.state)));
  }

  subscribe(cb) {
    this.subscribers.push(cb);
  }
}

const compiler = new Compiler();

onconnect = (e) => expose(compiler, e.ports[0]);
