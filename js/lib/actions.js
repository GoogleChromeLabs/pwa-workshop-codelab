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

export class Actions {
  constructor() {}

  /**
   * Function to call when the open button is triggered
   */
  async open() {}

  /**
   * Function to call when the save button is triggered
   */
  async save() {}

  /**
   * Function to call when the duplicate/save as button is triggered
   */
  async saveAs() {}

  /**
   * Reset the editor and file handler
   */
  async reset() {}

  /**
   * Function to call when the preview button is triggered
   */
  async preview() {}

  /**
   * Function to call when the focus button is triggered
   */
  async focus() {}
}
