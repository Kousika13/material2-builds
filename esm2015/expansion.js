/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken, Directive, TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, EventEmitter, ElementRef, Input, Inject, Optional, Output, SkipSelf, ViewContainerRef, ViewEncapsulation, ViewChild, Host, ContentChildren, NgModule } from '@angular/core';
import { animate, animateChild, group, state, style, transition, trigger, query } from '@angular/animations';
import { CdkAccordionItem, CdkAccordion, CdkAccordionModule } from '@angular/cdk/accordion';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { TemplatePortal, PortalModule } from '@angular/cdk/portal';
import { DOCUMENT, CommonModule } from '@angular/common';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { Subject, merge, Subscription, EMPTY } from 'rxjs';
import { filter, startWith, take, distinctUntilChanged } from 'rxjs/operators';
import { FocusMonitor, FocusKeyManager } from '@angular/cdk/a11y';
import { ENTER, SPACE, hasModifierKey, HOME, END } from '@angular/cdk/keycodes';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Token used to provide a `MatAccordion` to `MatExpansionPanel`.
 * Used primarily to avoid circular imports between `MatAccordion` and `MatExpansionPanel`.
 * @type {?}
 */
const MAT_ACCORDION = new InjectionToken('MAT_ACCORDION');

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Time and timing curve for expansion panel animations.
 * @type {?}
 */
const EXPANSION_PANEL_ANIMATION_TIMING = '225ms cubic-bezier(0.4,0.0,0.2,1)';
/**
 * Animations used by the Material expansion panel.
 *
 * A bug in angular animation's `state` when ViewContainers are moved using ViewContainerRef.move()
 * causes the animation state of moved components to become `void` upon exit, and not update again
 * upon reentry into the DOM.  This can lead a to situation for the expansion panel where the state
 * of the panel is `expanded` or `collapsed` but the animation state is `void`.
 *
 * To correctly handle animating to the next state, we animate between `void` and `collapsed` which
 * are defined to have the same styles. Since angular animates from the current styles to the
 * destination state's style definition, in situations where we are moving from `void`'s styles to
 * `collapsed` this acts a noop since no style values change.
 *
 * In the case where angular's animation state is out of sync with the expansion panel's state, the
 * expansion panel being `expanded` and angular animations being `void`, the animation from the
 * `expanded`'s effective styles (though in a `void` animation state) to the collapsed state will
 * occur as expected.
 *
 * Angular Bug: https://github.com/angular/angular/issues/18847
 *
 * \@docs-private
 * @type {?}
 */
const matExpansionAnimations = {
    /**
     * Animation that rotates the indicator arrow.
     */
    indicatorRotate: trigger('indicatorRotate', [
        state('collapsed, void', style({ transform: 'rotate(0deg)' })),
        state('expanded', style({ transform: 'rotate(180deg)' })),
        transition('expanded <=> collapsed, void => collapsed', animate(EXPANSION_PANEL_ANIMATION_TIMING)),
    ]),
    /**
     * Animation that expands and collapses the panel header height.
     */
    expansionHeaderHeight: trigger('expansionHeight', [
        state('collapsed, void', style({
            height: '{{collapsedHeight}}',
        }), {
            params: { collapsedHeight: '48px' },
        }),
        state('expanded', style({
            height: '{{expandedHeight}}'
        }), {
            params: { expandedHeight: '64px' }
        }),
        transition('expanded <=> collapsed, void => collapsed', group([
            query('@indicatorRotate', animateChild(), { optional: true }),
            animate(EXPANSION_PANEL_ANIMATION_TIMING),
        ])),
    ]),
    /**
     * Animation that expands and collapses the panel content.
     */
    bodyExpansion: trigger('bodyExpansion', [
        state('collapsed, void', style({ height: '0px', visibility: 'hidden' })),
        state('expanded', style({ height: '*', visibility: 'visible' })),
        transition('expanded <=> collapsed, void => collapsed', animate(EXPANSION_PANEL_ANIMATION_TIMING)),
    ])
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Expansion panel content that will be rendered lazily
 * after the panel is opened for the first time.
 */
class MatExpansionPanelContent {
    /**
     * @param {?} _template
     */
    constructor(_template) {
        this._template = _template;
    }
}
MatExpansionPanelContent.decorators = [
    { type: Directive, args: [{
                selector: 'ng-template[matExpansionPanelContent]'
            },] },
];
/** @nocollapse */
MatExpansionPanelContent.ctorParameters = () => [
    { type: TemplateRef }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Counter for generating unique element ids.
 * @type {?}
 */
let uniqueId = 0;
/**
 * Injection token that can be used to configure the defalt
 * options for the expansion panel component.
 * @type {?}
 */
const MAT_EXPANSION_PANEL_DEFAULT_OPTIONS = new InjectionToken('MAT_EXPANSION_PANEL_DEFAULT_OPTIONS');
const ɵ0 = undefined;
/**
 * `<mat-expansion-panel>`
 *
 * This component can be used as a single element to show expandable content, or as one of
 * multiple children of an element with the MatAccordion directive attached.
 */
class MatExpansionPanel extends CdkAccordionItem {
    /**
     * @param {?} accordion
     * @param {?} _changeDetectorRef
     * @param {?} _uniqueSelectionDispatcher
     * @param {?} _viewContainerRef
     * @param {?=} _document
     * @param {?=} _animationMode
     * @param {?=} defaultOptions
     */
    constructor(accordion, _changeDetectorRef, _uniqueSelectionDispatcher, _viewContainerRef, 
    // @breaking-change 8.0.0 _document and _animationMode to be made required
    _document, _animationMode, defaultOptions) {
        super(accordion, _changeDetectorRef, _uniqueSelectionDispatcher);
        this._viewContainerRef = _viewContainerRef;
        this._animationMode = _animationMode;
        this._hideToggle = false;
        /**
         * An event emitted after the body's expansion animation happens.
         */
        this.afterExpand = new EventEmitter();
        /**
         * An event emitted after the body's collapse animation happens.
         */
        this.afterCollapse = new EventEmitter();
        /**
         * Stream that emits for changes in `\@Input` properties.
         */
        this._inputChanges = new Subject();
        /**
         * ID for the associated header element. Used for a11y labelling.
         */
        this._headerId = `mat-expansion-panel-header-${uniqueId++}`;
        /**
         * Stream of body animation done events.
         */
        this._bodyAnimationDone = new Subject();
        this.accordion = accordion;
        this._document = _document;
        // We need a Subject with distinctUntilChanged, because the `done` event
        // fires twice on some browsers. See https://github.com/angular/angular/issues/24084
        this._bodyAnimationDone.pipe(distinctUntilChanged((x, y) => {
            return x.fromState === y.fromState && x.toState === y.toState;
        })).subscribe(event => {
            if (event.fromState !== 'void') {
                if (event.toState === 'expanded') {
                    this.afterExpand.emit();
                }
                else if (event.toState === 'collapsed') {
                    this.afterCollapse.emit();
                }
            }
        });
        if (defaultOptions) {
            this.hideToggle = defaultOptions.hideToggle;
        }
    }
    /**
     * Whether the toggle indicator should be hidden.
     * @return {?}
     */
    get hideToggle() {
        return this._hideToggle || (this.accordion && this.accordion.hideToggle);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set hideToggle(value) {
        this._hideToggle = coerceBooleanProperty(value);
    }
    /**
     * Determines whether the expansion panel should have spacing between it and its siblings.
     * @return {?}
     */
    _hasSpacing() {
        if (this.accordion) {
            // We don't need to subscribe to the `stateChanges` of the parent accordion because each time
            // the [displayMode] input changes, the change detection will also cover the host bindings
            // of this expansion panel.
            return (this.expanded ? this.accordion.displayMode : this._getExpandedState()) === 'default';
        }
        return false;
    }
    /**
     * Gets the expanded state string.
     * @return {?}
     */
    _getExpandedState() {
        return this.expanded ? 'expanded' : 'collapsed';
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        if (this._lazyContent) {
            // Render the content as soon as the panel becomes open.
            this.opened.pipe(startWith((/** @type {?} */ (null))), filter(() => this.expanded && !this._portal), take(1)).subscribe(() => {
                this._portal = new TemplatePortal(this._lazyContent._template, this._viewContainerRef);
            });
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        this._inputChanges.next(changes);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        super.ngOnDestroy();
        this._bodyAnimationDone.complete();
        this._inputChanges.complete();
    }
    /**
     * Checks whether the expansion panel's content contains the currently-focused element.
     * @return {?}
     */
    _containsFocus() {
        if (this._body && this._document) {
            /** @type {?} */
            const focusedElement = this._document.activeElement;
            /** @type {?} */
            const bodyElement = this._body.nativeElement;
            return focusedElement === bodyElement || bodyElement.contains(focusedElement);
        }
        return false;
    }
}
MatExpansionPanel.decorators = [
    { type: Component, args: [{styles: [".mat-expansion-panel{box-sizing:content-box;display:block;margin:0;border-radius:4px;overflow:hidden;transition:margin 225ms cubic-bezier(.4,0,.2,1),box-shadow 280ms cubic-bezier(.4,0,.2,1)}.mat-accordion .mat-expansion-panel:not(.mat-expanded),.mat-accordion .mat-expansion-panel:not(.mat-expansion-panel-spacing){border-radius:0}.mat-accordion .mat-expansion-panel:first-of-type{border-top-right-radius:4px;border-top-left-radius:4px}.mat-accordion .mat-expansion-panel:last-of-type{border-bottom-right-radius:4px;border-bottom-left-radius:4px}@media (-ms-high-contrast:active){.mat-expansion-panel{outline:solid 1px}}.mat-expansion-panel._mat-animation-noopable,.mat-expansion-panel.ng-animate-disabled,.ng-animate-disabled .mat-expansion-panel{transition:none}.mat-expansion-panel-content{display:flex;flex-direction:column;overflow:visible}.mat-expansion-panel-body{padding:0 24px 16px}.mat-expansion-panel-spacing{margin:16px 0}.mat-accordion>.mat-expansion-panel-spacing:first-child,.mat-accordion>:first-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing{margin-top:0}.mat-accordion>.mat-expansion-panel-spacing:last-child,.mat-accordion>:last-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing{margin-bottom:0}.mat-action-row{border-top-style:solid;border-top-width:1px;display:flex;flex-direction:row;justify-content:flex-end;padding:16px 8px 16px 24px}.mat-action-row button.mat-button{margin-left:8px}[dir=rtl] .mat-action-row button.mat-button{margin-left:0;margin-right:8px}"],
                selector: 'mat-expansion-panel',
                exportAs: 'matExpansionPanel',
                template: "<ng-content select=\"mat-expansion-panel-header\"></ng-content><div class=\"mat-expansion-panel-content\" role=\"region\" [@bodyExpansion]=\"_getExpandedState()\" (@bodyExpansion.done)=\"_bodyAnimationDone.next($event)\" [attr.aria-labelledby]=\"_headerId\" [id]=\"id\" #body><div class=\"mat-expansion-panel-body\"><ng-content></ng-content><ng-template [cdkPortalOutlet]=\"_portal\"></ng-template></div><ng-content select=\"mat-action-row\"></ng-content></div>",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                inputs: ['disabled', 'expanded'],
                outputs: ['opened', 'closed', 'expandedChange'],
                animations: [matExpansionAnimations.bodyExpansion],
                providers: [
                    // Provide MatAccordion as undefined to prevent nested expansion panels from registering
                    // to the same accordion.
                    { provide: MAT_ACCORDION, useValue: ɵ0 },
                ],
                host: {
                    'class': 'mat-expansion-panel',
                    '[class.mat-expanded]': 'expanded',
                    '[class._mat-animation-noopable]': '_animationMode === "NoopAnimations"',
                    '[class.mat-expansion-panel-spacing]': '_hasSpacing()',
                }
            },] },
];
/** @nocollapse */
MatExpansionPanel.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Optional }, { type: SkipSelf }, { type: Inject, args: [MAT_ACCORDION,] }] },
    { type: ChangeDetectorRef },
    { type: UniqueSelectionDispatcher },
    { type: ViewContainerRef },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_EXPANSION_PANEL_DEFAULT_OPTIONS,] }, { type: Optional }] }
];
MatExpansionPanel.propDecorators = {
    hideToggle: [{ type: Input }],
    afterExpand: [{ type: Output }],
    afterCollapse: [{ type: Output }],
    _lazyContent: [{ type: ContentChild, args: [MatExpansionPanelContent,] }],
    _body: [{ type: ViewChild, args: ['body',] }]
};
class MatExpansionPanelActionRow {
}
MatExpansionPanelActionRow.decorators = [
    { type: Directive, args: [{
                selector: 'mat-action-row',
                host: {
                    class: 'mat-action-row'
                }
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * `<mat-expansion-panel-header>`
 *
 * This component corresponds to the header element of an `<mat-expansion-panel>`.
 */
class MatExpansionPanelHeader {
    /**
     * @param {?} panel
     * @param {?} _element
     * @param {?} _focusMonitor
     * @param {?} _changeDetectorRef
     * @param {?=} defaultOptions
     */
    constructor(panel, _element, _focusMonitor, _changeDetectorRef, defaultOptions) {
        this.panel = panel;
        this._element = _element;
        this._focusMonitor = _focusMonitor;
        this._changeDetectorRef = _changeDetectorRef;
        this._parentChangeSubscription = Subscription.EMPTY;
        /** @type {?} */
        const accordionHideToggleChange = panel.accordion ?
            panel.accordion._stateChanges.pipe(filter(changes => !!changes['hideToggle'])) :
            EMPTY;
        // Since the toggle state depends on an @Input on the panel, we
        // need to subscribe and trigger change detection manually.
        this._parentChangeSubscription =
            merge(panel.opened, panel.closed, accordionHideToggleChange, panel._inputChanges.pipe(filter(changes => !!(changes['hideToggle'] || changes['disabled']))))
                .subscribe(() => this._changeDetectorRef.markForCheck());
        // Avoids focus being lost if the panel contained the focused element and was closed.
        panel.closed
            .pipe(filter(() => panel._containsFocus()))
            .subscribe(() => _focusMonitor.focusVia(_element, 'program'));
        _focusMonitor.monitor(_element).subscribe(origin => {
            if (origin && panel.accordion) {
                panel.accordion._handleHeaderFocus(this);
            }
        });
        if (defaultOptions) {
            this.expandedHeight = defaultOptions.expandedHeight;
            this.collapsedHeight = defaultOptions.collapsedHeight;
        }
    }
    /**
     * Whether the associated panel is disabled. Implemented as a part of `FocusableOption`.
     * \@docs-private
     * @return {?}
     */
    get disabled() {
        return this.panel.disabled;
    }
    /**
     * Toggles the expanded state of the panel.
     * @return {?}
     */
    _toggle() {
        this.panel.toggle();
    }
    /**
     * Gets whether the panel is expanded.
     * @return {?}
     */
    _isExpanded() {
        return this.panel.expanded;
    }
    /**
     * Gets the expanded state string of the panel.
     * @return {?}
     */
    _getExpandedState() {
        return this.panel._getExpandedState();
    }
    /**
     * Gets the panel id.
     * @return {?}
     */
    _getPanelId() {
        return this.panel.id;
    }
    /**
     * Gets whether the expand indicator should be shown.
     * @return {?}
     */
    _showToggle() {
        return !this.panel.hideToggle && !this.panel.disabled;
    }
    /**
     * Handle keydown event calling to toggle() if appropriate.
     * @param {?} event
     * @return {?}
     */
    _keydown(event) {
        switch (event.keyCode) {
            // Toggle for space and enter keys.
            case SPACE:
            case ENTER:
                if (!hasModifierKey(event)) {
                    event.preventDefault();
                    this._toggle();
                }
                break;
            default:
                if (this.panel.accordion) {
                    this.panel.accordion._handleHeaderKeydown(event);
                }
                return;
        }
    }
    /**
     * Focuses the panel header. Implemented as a part of `FocusableOption`.
     * \@docs-private
     * @param {?=} origin Origin of the action that triggered the focus.
     * @return {?}
     */
    focus(origin = 'program') {
        this._focusMonitor.focusVia(this._element, origin);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._parentChangeSubscription.unsubscribe();
        this._focusMonitor.stopMonitoring(this._element);
    }
}
MatExpansionPanelHeader.decorators = [
    { type: Component, args: [{selector: 'mat-expansion-panel-header',
                styles: [".mat-expansion-panel-header{display:flex;flex-direction:row;align-items:center;padding:0 24px;border-radius:inherit}.mat-expansion-panel-header:focus,.mat-expansion-panel-header:hover{outline:0}.mat-expansion-panel-header.mat-expanded:focus,.mat-expansion-panel-header.mat-expanded:hover{background:inherit}.mat-expansion-panel-header:not([aria-disabled=true]){cursor:pointer}.mat-content{display:flex;flex:1;flex-direction:row;overflow:hidden}.mat-expansion-panel-header-description,.mat-expansion-panel-header-title{display:flex;flex-grow:1;margin-right:16px}[dir=rtl] .mat-expansion-panel-header-description,[dir=rtl] .mat-expansion-panel-header-title{margin-right:0;margin-left:16px}.mat-expansion-panel-header-description{flex-grow:2}.mat-expansion-indicator::after{border-style:solid;border-width:0 2px 2px 0;content:'';display:inline-block;padding:3px;transform:rotate(45deg);vertical-align:middle}"],
                template: "<span class=\"mat-content\"><ng-content select=\"mat-panel-title\"></ng-content><ng-content select=\"mat-panel-description\"></ng-content><ng-content></ng-content></span><span [@indicatorRotate]=\"_getExpandedState()\" *ngIf=\"_showToggle()\" class=\"mat-expansion-indicator\"></span>",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                animations: [
                    matExpansionAnimations.indicatorRotate,
                    matExpansionAnimations.expansionHeaderHeight
                ],
                host: {
                    'class': 'mat-expansion-panel-header',
                    'role': 'button',
                    '[attr.id]': 'panel._headerId',
                    '[attr.tabindex]': 'disabled ? -1 : 0',
                    '[attr.aria-controls]': '_getPanelId()',
                    '[attr.aria-expanded]': '_isExpanded()',
                    '[attr.aria-disabled]': 'panel.disabled',
                    '[class.mat-expanded]': '_isExpanded()',
                    '(click)': '_toggle()',
                    '(keydown)': '_keydown($event)',
                    '[@expansionHeight]': `{
        value: _getExpandedState(),
        params: {
          collapsedHeight: collapsedHeight,
          expandedHeight: expandedHeight
        }
    }`,
                },
            },] },
];
/** @nocollapse */
MatExpansionPanelHeader.ctorParameters = () => [
    { type: MatExpansionPanel, decorators: [{ type: Host }] },
    { type: ElementRef },
    { type: FocusMonitor },
    { type: ChangeDetectorRef },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_EXPANSION_PANEL_DEFAULT_OPTIONS,] }, { type: Optional }] }
];
MatExpansionPanelHeader.propDecorators = {
    expandedHeight: [{ type: Input }],
    collapsedHeight: [{ type: Input }]
};
/**
 * `<mat-panel-description>`
 *
 * This directive is to be used inside of the MatExpansionPanelHeader component.
 */
class MatExpansionPanelDescription {
}
MatExpansionPanelDescription.decorators = [
    { type: Directive, args: [{
                selector: 'mat-panel-description',
                host: {
                    class: 'mat-expansion-panel-header-description'
                }
            },] },
];
/**
 * `<mat-panel-title>`
 *
 * This directive is to be used inside of the MatExpansionPanelHeader component.
 */
class MatExpansionPanelTitle {
}
MatExpansionPanelTitle.decorators = [
    { type: Directive, args: [{
                selector: 'mat-panel-title',
                host: {
                    class: 'mat-expansion-panel-header-title'
                }
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Directive for a Material Design Accordion.
 */
class MatAccordion extends CdkAccordion {
    constructor() {
        super(...arguments);
        this._hideToggle = false;
        /**
         * Display mode used for all expansion panels in the accordion. Currently two display
         * modes exist:
         *  default - a gutter-like spacing is placed around any expanded panel, placing the expanded
         *     panel at a different elevation from the rest of the accordion.
         *  flat - no spacing is placed around expanded panels, showing all panels at the same
         *     elevation.
         */
        this.displayMode = 'default';
    }
    /**
     * Whether the expansion indicator should be hidden.
     * @return {?}
     */
    get hideToggle() { return this._hideToggle; }
    /**
     * @param {?} show
     * @return {?}
     */
    set hideToggle(show) { this._hideToggle = coerceBooleanProperty(show); }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._keyManager = new FocusKeyManager(this._headers).withWrap();
    }
    /**
     * Handles keyboard events coming in from the panel headers.
     * @param {?} event
     * @return {?}
     */
    _handleHeaderKeydown(event) {
        const { keyCode } = event;
        /** @type {?} */
        const manager = this._keyManager;
        if (keyCode === HOME) {
            manager.setFirstItemActive();
            event.preventDefault();
        }
        else if (keyCode === END) {
            manager.setLastItemActive();
            event.preventDefault();
        }
        else {
            this._keyManager.onKeydown(event);
        }
    }
    /**
     * @param {?} header
     * @return {?}
     */
    _handleHeaderFocus(header) {
        this._keyManager.updateActiveItem(header);
    }
}
MatAccordion.decorators = [
    { type: Directive, args: [{
                selector: 'mat-accordion',
                exportAs: 'matAccordion',
                inputs: ['multi'],
                providers: [{
                        provide: MAT_ACCORDION,
                        useExisting: MatAccordion
                    }],
                host: {
                    class: 'mat-accordion'
                }
            },] },
];
MatAccordion.propDecorators = {
    _headers: [{ type: ContentChildren, args: [MatExpansionPanelHeader, { descendants: true },] }],
    hideToggle: [{ type: Input }],
    displayMode: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class MatExpansionModule {
}
MatExpansionModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, CdkAccordionModule, PortalModule],
                exports: [
                    MatAccordion,
                    MatExpansionPanel,
                    MatExpansionPanelActionRow,
                    MatExpansionPanelHeader,
                    MatExpansionPanelTitle,
                    MatExpansionPanelDescription,
                    MatExpansionPanelContent,
                ],
                declarations: [
                    MatAccordion,
                    MatExpansionPanel,
                    MatExpansionPanelActionRow,
                    MatExpansionPanelHeader,
                    MatExpansionPanelTitle,
                    MatExpansionPanelDescription,
                    MatExpansionPanelContent,
                ],
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { MatExpansionModule, MatAccordion, MAT_ACCORDION, MAT_EXPANSION_PANEL_DEFAULT_OPTIONS, MatExpansionPanel, MatExpansionPanelActionRow, MatExpansionPanelHeader, MatExpansionPanelDescription, MatExpansionPanelTitle, MatExpansionPanelContent, EXPANSION_PANEL_ANIMATION_TIMING, matExpansionAnimations };
//# sourceMappingURL=expansion.js.map
