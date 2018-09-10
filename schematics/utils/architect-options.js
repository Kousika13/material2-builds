"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** Resolves the architect options for the build target of the given project. */
function getArchitectOptions(project, buildTarget) {
    if (project.architect &&
        project.architect[buildTarget] &&
        project.architect[buildTarget].options) {
        return project.architect[buildTarget].options;
    }
    throw new Error(`Cannot determine architect configuration for target: ${buildTarget}.`);
}
exports.getArchitectOptions = getArchitectOptions;
//# sourceMappingURL=architect-options.js.map