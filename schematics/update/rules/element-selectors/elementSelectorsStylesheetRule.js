"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const tslint_1 = require("tslint");
const element_selectors_1 = require("../../material/data/element-selectors");
const transform_change_data_1 = require("../../material/transform-change-data");
const component_walker_1 = require("../../tslint/component-walker");
const literal_1 = require("../../typescript/literal");
/**
 * Rule that walks through every inline or external CSS stylesheet and updates outdated
 * element selectors.
 */
class Rule extends tslint_1.Rules.AbstractRule {
    apply(sourceFile) {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions()));
    }
}
exports.Rule = Rule;
class Walker extends component_walker_1.ComponentWalker {
    constructor(sourceFile, options) {
        super(sourceFile, options);
        /** Change data that upgrades to the specified target version. */
        this.data = transform_change_data_1.getChangesForTarget(this.getOptions()[0], element_selectors_1.elementSelectors);
        this._reportExtraStylesheetFiles(options.ruleArguments[1]);
    }
    visitInlineStylesheet(node) {
        this._createReplacementsForContent(node, node.getText()).forEach(data => {
            this.addFailureAtReplacement(data.failureMessage, data.replacement);
        });
    }
    visitExternalStylesheet(node) {
        this._createReplacementsForContent(node, node.getText()).forEach(data => {
            this.addExternalFailureAtReplacement(node, data.failureMessage, data.replacement);
        });
    }
    /**
     * Searches for outdated element selectors in the specified content and creates replacements
     * with the according messages that can be added to a rule failure.
     */
    _createReplacementsForContent(node, stylesheetContent) {
        const replacements = [];
        this.data.forEach(selector => {
            const failureMessage = `Found deprecated element selector "${chalk_1.red(selector.replace)}" ` +
                `which has been renamed to "${chalk_1.green(selector.replaceWith)}"`;
            literal_1.findAllSubstringIndices(stylesheetContent, selector.replace)
                .map(offset => node.getStart() + offset)
                .map(start => new tslint_1.Replacement(start, selector.replace.length, selector.replaceWith))
                .forEach(replacement => replacements.push({ replacement, failureMessage }));
        });
        return replacements;
    }
}
exports.Walker = Walker;
//# sourceMappingURL=elementSelectorsStylesheetRule.js.map