/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/cdk/a11y'), require('@angular/cdk/overlay'), require('@angular/common'), require('@angular/core'), require('@angular/material/core'), require('@angular/cdk/scrolling'), require('@angular/animations'), require('@angular/cdk/bidi'), require('@angular/cdk/coercion'), require('@angular/cdk/keycodes'), require('@angular/platform-browser'), require('rxjs/observable/merge'), require('rxjs/operators'), require('rxjs/Subject')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/cdk/a11y', '@angular/cdk/overlay', '@angular/common', '@angular/core', '@angular/material/core', '@angular/cdk/scrolling', '@angular/animations', '@angular/cdk/bidi', '@angular/cdk/coercion', '@angular/cdk/keycodes', '@angular/platform-browser', 'rxjs/observable/merge', 'rxjs/operators', 'rxjs/Subject'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.material = global.ng.material || {}, global.ng.material.sidenav = global.ng.material.sidenav || {}),global.ng.cdk.a11y,global.ng.cdk.overlay,global.ng.common,global.ng.core,global.ng.material.core,global.ng.cdk.scrolling,global.ng.animations,global.ng.cdk.bidi,global.ng.cdk.coercion,global.ng.cdk.keycodes,global.ng.platformBrowser,global.Rx.Observable,global.Rx.Observable,global.Rx));
}(this, (function (exports,_angular_cdk_a11y,_angular_cdk_overlay,_angular_common,_angular_core,_angular_material_core,_angular_cdk_scrolling,_angular_animations,_angular_cdk_bidi,_angular_cdk_coercion,_angular_cdk_keycodes,_angular_platformBrowser,rxjs_observable_merge,rxjs_operators,rxjs_Subject) { 'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

/**
 * Throws an exception when two MatDrawer are matching the same position.
 * @param {?} position
 * @return {?}
 */
function throwMatDuplicatedDrawerError(position) {
    throw Error("A drawer was already declared for 'position=\"" + position + "\"'");
}
/**
 * Drawer toggle promise result.
 * @deprecated
 */
var MatDrawerToggleResult = (function () {
    /**
     * @param {?} type
     * @param {?} animationFinished
     */
    function MatDrawerToggleResult(type, animationFinished) {
        this.type = type;
        this.animationFinished = animationFinished;
    }
    return MatDrawerToggleResult;
}());
var MatDrawerContent = (function () {
    /**
     * @param {?} _changeDetectorRef
     * @param {?} _container
     */
    function MatDrawerContent(_changeDetectorRef, _container) {
        this._changeDetectorRef = _changeDetectorRef;
        this._container = _container;
        /**
         * Margins to be applied to the content. These are used to push / shrink the drawer content when a
         * drawer is open. We use margin rather than transform even for push mode because transform breaks
         * fixed position elements inside of the transformed element.
         */
        this._margins = { left: 0, right: 0 };
    }
    /**
     * @return {?}
     */
    MatDrawerContent.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._container._contentMargins.subscribe(function (margins) {
            _this._margins = margins;
            _this._changeDetectorRef.markForCheck();
        });
    };
    MatDrawerContent.decorators = [
        { type: _angular_core.Component, args: [{selector: 'mat-drawer-content',
                    template: '<ng-content></ng-content>',
                    host: {
                        'class': 'mat-drawer-content',
                        '[style.marginLeft.px]': '_margins.left',
                        '[style.marginRight.px]': '_margins.right',
                    },
                    changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                    encapsulation: _angular_core.ViewEncapsulation.None,
                    preserveWhitespaces: false,
                },] },
    ];
    /**
     * @nocollapse
     */
    MatDrawerContent.ctorParameters = function () { return [
        { type: _angular_core.ChangeDetectorRef, },
        { type: MatDrawerContainer, decorators: [{ type: _angular_core.Inject, args: [_angular_core.forwardRef(function () { return MatDrawerContainer; }),] },] },
    ]; };
    return MatDrawerContent;
}());
/**
 * This component corresponds to a drawer that can be opened on the drawer container.
 */
var MatDrawer = (function () {
    /**
     * @param {?} _elementRef
     * @param {?} _focusTrapFactory
     * @param {?} _focusMonitor
     * @param {?} _doc
     */
    function MatDrawer(_elementRef, _focusTrapFactory, _focusMonitor, _doc) {
        var _this = this;
        this._elementRef = _elementRef;
        this._focusTrapFactory = _focusTrapFactory;
        this._focusMonitor = _focusMonitor;
        this._doc = _doc;
        this._elementFocusedBeforeDrawerWasOpened = null;
        /**
         * Whether the drawer is initialized. Used for disabling the initial animation.
         */
        this._enableAnimations = false;
        this._position = 'start';
        this._mode = 'over';
        this._disableClose = false;
        /**
         * Whether the drawer is opened.
         */
        this._opened = false;
        /**
         * Emits whenever the drawer has started animating.
         */
        this._animationStarted = new _angular_core.EventEmitter();
        /**
         * Current state of the sidenav animation.
         */
        this._animationState = 'void';
        /**
         * Event emitted when the drawer open state is changed.
         */
        this.openedChange = new _angular_core.EventEmitter();
        /**
         * Event emitted when the drawer is fully opened.
         * @deprecated Use `openedChange` instead.
         */
        this.onOpen = this._openedStream;
        /**
         * Event emitted when the drawer is fully closed.
         * @deprecated Use `openedChange` instead.
         */
        this.onClose = this._closedStream;
        /**
         * Event emitted when the drawer's position changes.
         */
        this.onPositionChanged = new _angular_core.EventEmitter();
        /**
         * @deprecated
         */
        this.onAlignChanged = new _angular_core.EventEmitter();
        /**
         * An observable that emits when the drawer mode changes. This is used by the drawer container to
         * to know when to when the mode changes so it can adapt the margins on the content.
         */
        this._modeChanged = new rxjs_Subject.Subject();
        this.openedChange.subscribe(function (opened) {
            if (opened) {
                if (_this._doc) {
                    _this._elementFocusedBeforeDrawerWasOpened = _this._doc.activeElement;
                }
                if (_this._isFocusTrapEnabled && _this._focusTrap) {
                    _this._focusTrap.focusInitialElementWhenReady();
                }
            }
            else {
                _this._restoreFocus();
            }
        });
    }
    Object.defineProperty(MatDrawer.prototype, "position", {
        /**
         * The side that the drawer is attached to.
         * @return {?}
         */
        get: function () { return this._position; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            // Make sure we have a valid value.
            value = value === 'end' ? 'end' : 'start';
            if (value != this._position) {
                this._position = value;
                this.onAlignChanged.emit();
                this.onPositionChanged.emit();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDrawer.prototype, "align", {
        /**
         * @deprecated
         * @return {?}
         */
        get: function () { return this.position; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this.position = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDrawer.prototype, "mode", {
        /**
         * Mode of the drawer; one of 'over', 'push' or 'side'.
         * @return {?}
         */
        get: function () { return this._mode; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._mode = value;
            this._modeChanged.next();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDrawer.prototype, "disableClose", {
        /**
         * Whether the drawer can be closed with the escape key or by clicking on the backdrop.
         * @return {?}
         */
        get: function () { return this._disableClose; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._disableClose = _angular_cdk_coercion.coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDrawer.prototype, "_openedStream", {
        /**
         * Event emitted when the drawer has been opened.
         * @return {?}
         */
        get: function () {
            return this.openedChange.pipe(rxjs_operators.filter(function (o) { return o; }), rxjs_operators.map(function () { }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDrawer.prototype, "_closedStream", {
        /**
         * Event emitted when the drawer has been closed.
         * @return {?}
         */
        get: function () {
            return this.openedChange.pipe(rxjs_operators.filter(function (o) { return !o; }), rxjs_operators.map(function () { }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDrawer.prototype, "_isFocusTrapEnabled", {
        /**
         * @return {?}
         */
        get: function () {
            // The focus trap is only enabled when the drawer is open in any mode other than side.
            return this.opened && this.mode !== 'side';
        },
        enumerable: true,
        configurable: true
    });
    /**
     * If focus is currently inside the drawer, restores it to where it was before the drawer
     * opened.
     * @return {?}
     */
    MatDrawer.prototype._restoreFocus = function () {
        var /** @type {?} */ activeEl = this._doc && this._doc.activeElement;
        if (activeEl && this._elementRef.nativeElement.contains(activeEl)) {
            if (this._elementFocusedBeforeDrawerWasOpened instanceof HTMLElement) {
                this._focusMonitor.focusVia(this._elementFocusedBeforeDrawerWasOpened, this._openedVia);
            }
            else {
                this._elementRef.nativeElement.blur();
            }
        }
        this._elementFocusedBeforeDrawerWasOpened = null;
        this._openedVia = null;
    };
    /**
     * @return {?}
     */
    MatDrawer.prototype.ngAfterContentInit = function () {
        this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
        this._focusTrap.enabled = this._isFocusTrapEnabled;
        this._enableAnimations = true;
    };
    /**
     * @return {?}
     */
    MatDrawer.prototype.ngOnDestroy = function () {
        if (this._focusTrap) {
            this._focusTrap.destroy();
        }
    };
    Object.defineProperty(MatDrawer.prototype, "opened", {
        /**
         * Whether the drawer is opened. We overload this because we trigger an event when it
         * starts or end.
         * @return {?}
         */
        get: function () { return this._opened; },
        /**
         * @param {?} v
         * @return {?}
         */
        set: function (v) {
            this.toggle(_angular_cdk_coercion.coerceBooleanProperty(v));
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Open the drawer.
     * @param {?=} openedVia Whether the drawer was opened by a key press, mouse click or programmatically.
     * Used for focus management after the sidenav is closed.
     * @return {?}
     */
    MatDrawer.prototype.open = function (openedVia) {
        return this.toggle(true, openedVia);
    };
    /**
     * Close the drawer.
     * @return {?}
     */
    MatDrawer.prototype.close = function () {
        return this.toggle(false);
    };
    /**
     * Toggle this drawer.
     * @param {?=} isOpen Whether the drawer should be open.
     * @param {?=} openedVia Whether the drawer was opened by a key press, mouse click or programmatically.
     * Used for focus management after the sidenav is closed.
     * @return {?}
     */
    MatDrawer.prototype.toggle = function (isOpen, openedVia) {
        var _this = this;
        if (isOpen === void 0) { isOpen = !this.opened; }
        if (openedVia === void 0) { openedVia = 'program'; }
        this._opened = isOpen;
        if (isOpen) {
            this._animationState = this._enableAnimations ? 'open' : 'open-instant';
            this._openedVia = openedVia;
        }
        else {
            this._animationState = 'void';
            this._restoreFocus();
        }
        if (this._focusTrap) {
            this._focusTrap.enabled = this._isFocusTrapEnabled;
        }
        // TODO(crisbeto): This promise is here for backwards-compatibility.
        // It should be removed next time we do breaking changes in the drawer.
        return new Promise(function (resolve) {
            (isOpen ? _this.onOpen : _this.onClose).pipe(rxjs_operators.first()).subscribe(resolve);
        });
    };
    /**
     * Handles the keyboard events.
     * \@docs-private
     * @param {?} event
     * @return {?}
     */
    MatDrawer.prototype.handleKeydown = function (event) {
        if (event.keyCode === _angular_cdk_keycodes.ESCAPE && !this.disableClose) {
            this.close();
            event.stopPropagation();
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MatDrawer.prototype._onAnimationStart = function (event) {
        this._animationStarted.emit(event);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MatDrawer.prototype._onAnimationEnd = function (event) {
        var fromState = event.fromState, toState = event.toState;
        if (toState.indexOf('open') === 0 && fromState === 'void') {
            this.openedChange.emit(true);
        }
        else if (toState === 'void' && fromState.indexOf('open') === 0) {
            this.openedChange.emit(false);
        }
    };
    Object.defineProperty(MatDrawer.prototype, "_width", {
        /**
         * @return {?}
         */
        get: function () {
            return this._elementRef.nativeElement ? (this._elementRef.nativeElement.offsetWidth || 0) : 0;
        },
        enumerable: true,
        configurable: true
    });
    MatDrawer.decorators = [
        { type: _angular_core.Component, args: [{selector: 'mat-drawer',
                    exportAs: 'matDrawer',
                    template: '<ng-content></ng-content>',
                    animations: [
                        _angular_animations.trigger('transform', [
                            _angular_animations.state('open, open-instant', _angular_animations.style({
                                transform: 'translate3d(0, 0, 0)',
                                visibility: 'visible',
                            })),
                            _angular_animations.state('void', _angular_animations.style({
                                visibility: 'hidden',
                            })),
                            _angular_animations.transition('void => open-instant', _angular_animations.animate('0ms')),
                            _angular_animations.transition('void <=> open, open-instant => void', _angular_animations.animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'))
                        ])
                    ],
                    host: {
                        'class': 'mat-drawer',
                        '[@transform]': '_animationState',
                        '(@transform.start)': '_onAnimationStart($event)',
                        '(@transform.done)': '_onAnimationEnd($event)',
                        '(keydown)': 'handleKeydown($event)',
                        // must prevent the browser from aligning text based on value
                        '[attr.align]': 'null',
                        '[class.mat-drawer-end]': 'position === "end"',
                        '[class.mat-drawer-over]': 'mode === "over"',
                        '[class.mat-drawer-push]': 'mode === "push"',
                        '[class.mat-drawer-side]': 'mode === "side"',
                        'tabIndex': '-1',
                    },
                    changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                    encapsulation: _angular_core.ViewEncapsulation.None,
                    preserveWhitespaces: false,
                },] },
    ];
    /**
     * @nocollapse
     */
    MatDrawer.ctorParameters = function () { return [
        { type: _angular_core.ElementRef, },
        { type: _angular_cdk_a11y.FocusTrapFactory, },
        { type: _angular_cdk_a11y.FocusMonitor, },
        { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [_angular_platformBrowser.DOCUMENT,] },] },
    ]; };
    MatDrawer.propDecorators = {
        'position': [{ type: _angular_core.Input },],
        'align': [{ type: _angular_core.Input },],
        'mode': [{ type: _angular_core.Input },],
        'disableClose': [{ type: _angular_core.Input },],
        'openedChange': [{ type: _angular_core.Output },],
        '_openedStream': [{ type: _angular_core.Output, args: ['opened',] },],
        '_closedStream': [{ type: _angular_core.Output, args: ['closed',] },],
        'onOpen': [{ type: _angular_core.Output, args: ['open',] },],
        'onClose': [{ type: _angular_core.Output, args: ['close',] },],
        'onPositionChanged': [{ type: _angular_core.Output, args: ['positionChanged',] },],
        'onAlignChanged': [{ type: _angular_core.Output, args: ['align-changed',] },],
        'opened': [{ type: _angular_core.Input },],
    };
    return MatDrawer;
}());
/**
 * <mat-drawer-container> component.
 *
 * This is the parent component to one or two <mat-drawer>s that validates the state internally
 * and coordinates the backdrop and content styling.
 */
var MatDrawerContainer = (function () {
    /**
     * @param {?} _dir
     * @param {?} _element
     * @param {?} _renderer
     * @param {?} _ngZone
     * @param {?} _changeDetectorRef
     */
    function MatDrawerContainer(_dir, _element, _renderer, _ngZone, _changeDetectorRef) {
        var _this = this;
        this._dir = _dir;
        this._element = _element;
        this._renderer = _renderer;
        this._ngZone = _ngZone;
        this._changeDetectorRef = _changeDetectorRef;
        /**
         * Event emitted when the drawer backdrop is clicked.
         */
        this.backdropClick = new _angular_core.EventEmitter();
        /**
         * Emits when the component is destroyed.
         */
        this._destroyed = new rxjs_Subject.Subject();
        this._contentMargins = new rxjs_Subject.Subject();
        // If a `Dir` directive exists up the tree, listen direction changes and update the left/right
        // properties to point to the proper start/end.
        if (_dir != null) {
            _dir.change.pipe(rxjs_operators.takeUntil(this._destroyed)).subscribe(function () { return _this._validateDrawers(); });
        }
    }
    Object.defineProperty(MatDrawerContainer.prototype, "start", {
        /**
         * The drawer child with the `start` position.
         * @return {?}
         */
        get: function () { return this._start; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatDrawerContainer.prototype, "end", {
        /**
         * The drawer child with the `end` position.
         * @return {?}
         */
        get: function () { return this._end; },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MatDrawerContainer.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._drawers.changes.pipe(rxjs_operators.startWith(null)).subscribe(function () {
            _this._validateDrawers();
            _this._drawers.forEach(function (drawer) {
                _this._watchDrawerToggle(drawer);
                _this._watchDrawerPosition(drawer);
                _this._watchDrawerMode(drawer);
            });
            if (!_this._drawers.length ||
                _this._isDrawerOpen(_this._start) ||
                _this._isDrawerOpen(_this._end)) {
                _this._updateContentMargins();
            }
            _this._changeDetectorRef.markForCheck();
        });
    };
    /**
     * @return {?}
     */
    MatDrawerContainer.prototype.ngOnDestroy = function () {
        this._destroyed.next();
        this._destroyed.complete();
    };
    /**
     * Calls `open` of both start and end drawers
     * @return {?}
     */
    MatDrawerContainer.prototype.open = function () {
        this._drawers.forEach(function (drawer) { return drawer.open(); });
    };
    /**
     * Calls `close` of both start and end drawers
     * @return {?}
     */
    MatDrawerContainer.prototype.close = function () {
        this._drawers.forEach(function (drawer) { return drawer.close(); });
    };
    /**
     * Subscribes to drawer events in order to set a class on the main container element when the
     * drawer is open and the backdrop is visible. This ensures any overflow on the container element
     * is properly hidden.
     * @param {?} drawer
     * @return {?}
     */
    MatDrawerContainer.prototype._watchDrawerToggle = function (drawer) {
        var _this = this;
        drawer._animationStarted.pipe(rxjs_operators.takeUntil(this._drawers.changes), rxjs_operators.filter(function (event) { return event.fromState !== event.toState; }))
            .subscribe(function (event) {
            // Set the transition class on the container so that the animations occur. This should not
            // be set initially because animations should only be triggered via a change in state.
            if (event.toState !== 'open-instant') {
                _this._renderer.addClass(_this._element.nativeElement, 'mat-drawer-transition');
            }
            _this._updateContentMargins();
            _this._changeDetectorRef.markForCheck();
        });
        if (drawer.mode !== 'side') {
            drawer.openedChange.pipe(rxjs_operators.takeUntil(this._drawers.changes)).subscribe(function () {
                return _this._setContainerClass(drawer.opened);
            });
        }
    };
    /**
     * Subscribes to drawer onPositionChanged event in order to
     * re-validate drawers when the position changes.
     * @param {?} drawer
     * @return {?}
     */
    MatDrawerContainer.prototype._watchDrawerPosition = function (drawer) {
        var _this = this;
        if (!drawer) {
            return;
        }
        // NOTE: We need to wait for the microtask queue to be empty before validating,
        // since both drawers may be swapping positions at the same time.
        drawer.onPositionChanged.pipe(rxjs_operators.takeUntil(this._drawers.changes)).subscribe(function () {
            _this._ngZone.onMicrotaskEmpty.asObservable().pipe(rxjs_operators.first()).subscribe(function () {
                _this._validateDrawers();
            });
        });
    };
    /**
     * Subscribes to changes in drawer mode so we can run change detection.
     * @param {?} drawer
     * @return {?}
     */
    MatDrawerContainer.prototype._watchDrawerMode = function (drawer) {
        var _this = this;
        if (drawer) {
            drawer._modeChanged.pipe(rxjs_operators.takeUntil(rxjs_observable_merge.merge(this._drawers.changes, this._destroyed)))
                .subscribe(function () {
                _this._updateContentMargins();
                _this._changeDetectorRef.markForCheck();
            });
        }
    };
    /**
     * Toggles the 'mat-drawer-opened' class on the main 'mat-drawer-container' element.
     * @param {?} isAdd
     * @return {?}
     */
    MatDrawerContainer.prototype._setContainerClass = function (isAdd) {
        if (isAdd) {
            this._renderer.addClass(this._element.nativeElement, 'mat-drawer-opened');
        }
        else {
            this._renderer.removeClass(this._element.nativeElement, 'mat-drawer-opened');
        }
    };
    /**
     * Validate the state of the drawer children components.
     * @return {?}
     */
    MatDrawerContainer.prototype._validateDrawers = function () {
        var _this = this;
        this._start = this._end = null;
        // Ensure that we have at most one start and one end drawer.
        this._drawers.forEach(function (drawer) {
            if (drawer.position == 'end') {
                if (_this._end != null) {
                    throwMatDuplicatedDrawerError('end');
                }
                _this._end = drawer;
            }
            else {
                if (_this._start != null) {
                    throwMatDuplicatedDrawerError('start');
                }
                _this._start = drawer;
            }
        });
        this._right = this._left = null;
        // Detect if we're LTR or RTL.
        if (this._dir == null || this._dir.value == 'ltr') {
            this._left = this._start;
            this._right = this._end;
        }
        else {
            this._left = this._end;
            this._right = this._start;
        }
    };
    /**
     * @return {?}
     */
    MatDrawerContainer.prototype._onBackdropClicked = function () {
        this.backdropClick.emit();
        this._closeModalDrawer();
    };
    /**
     * @return {?}
     */
    MatDrawerContainer.prototype._closeModalDrawer = function () {
        // Close all open drawers where closing is not disabled and the mode is not `side`.
        [this._start, this._end]
            .filter(function (drawer) { return drawer && !drawer.disableClose && drawer.mode !== 'side'; })
            .forEach(function (drawer) { /** @type {?} */ return ((drawer)).close(); });
    };
    /**
     * @return {?}
     */
    MatDrawerContainer.prototype._isShowingBackdrop = function () {
        return (this._isDrawerOpen(this._start) && ((this._start)).mode != 'side')
            || (this._isDrawerOpen(this._end) && ((this._end)).mode != 'side');
    };
    /**
     * @param {?} drawer
     * @return {?}
     */
    MatDrawerContainer.prototype._isDrawerOpen = function (drawer) {
        return drawer != null && drawer.opened;
    };
    /**
     * Recalculates and updates the inline styles for the content. Note that this should be used
     * sparingly, because it causes a reflow.
     * @return {?}
     */
    MatDrawerContainer.prototype._updateContentMargins = function () {
        // 1. For drawers in `over` mode, they don't affect the content.
        // 2. For drawers in `side` mode they should shrink the content. We do this by adding to the
        //    left margin (for left drawer) or right margin (for right the drawer).
        // 3. For drawers in `push` mode the should shift the content without resizing it. We do this by
        //    adding to the left or right margin and simultaneously subtracting the same amount of
        //    margin from the other side.
        var /** @type {?} */ left = 0;
        var /** @type {?} */ right = 0;
        if (this._left && this._left.opened) {
            if (this._left.mode == 'side') {
                left += this._left._width;
            }
            else if (this._left.mode == 'push') {
                var /** @type {?} */ width = this._left._width;
                left += width;
                right -= width;
            }
        }
        if (this._right && this._right.opened) {
            if (this._right.mode == 'side') {
                right += this._right._width;
            }
            else if (this._right.mode == 'push') {
                var /** @type {?} */ width = this._right._width;
                right += width;
                left -= width;
            }
        }
        this._contentMargins.next({ left: left, right: right });
    };
    MatDrawerContainer.decorators = [
        { type: _angular_core.Component, args: [{selector: 'mat-drawer-container',
                    exportAs: 'matDrawerContainer',
                    template: "<div class=\"mat-drawer-backdrop\" (click)=\"_onBackdropClicked()\" [class.mat-drawer-shown]=\"_isShowingBackdrop()\"></div><ng-content select=\"mat-drawer\"></ng-content><ng-content select=\"mat-drawer-content\"></ng-content><mat-drawer-content *ngIf=\"!_content\" cdkScrollable><ng-content></ng-content></mat-drawer-content>",
                    styles: [".mat-drawer-container{position:relative;z-index:1;box-sizing:border-box;-webkit-overflow-scrolling:touch;display:block;overflow:hidden}.mat-drawer-container[fullscreen]{top:0;left:0;right:0;bottom:0;position:absolute}.mat-drawer-container[fullscreen].mat-drawer-opened{overflow:hidden}.mat-drawer-backdrop{top:0;left:0;right:0;bottom:0;position:absolute;display:block;z-index:3;visibility:hidden}.mat-drawer-backdrop.mat-drawer-shown{visibility:visible}.mat-drawer-transition .mat-drawer-backdrop{transition-duration:.4s;transition-timing-function:cubic-bezier(.25,.8,.25,1);transition-property:background-color,visibility}@media screen and (-ms-high-contrast:active){.mat-drawer-backdrop{opacity:.5}}.mat-drawer-content{-webkit-backface-visibility:hidden;backface-visibility:hidden;position:relative;z-index:1;display:block;height:100%;overflow:auto}.mat-drawer-transition .mat-drawer-content{transition-duration:.4s;transition-timing-function:cubic-bezier(.25,.8,.25,1);transition-property:transform,margin-left,margin-right}.mat-drawer{position:relative;z-index:4;display:block;position:absolute;top:0;bottom:0;z-index:3;min-width:5vw;outline:0;box-sizing:border-box;overflow-y:auto;transform:translate3d(-100%,0,0)}.mat-drawer.mat-drawer-side{z-index:2}.mat-drawer.mat-drawer-end{right:0;transform:translate3d(100%,0,0)}[dir=rtl] .mat-drawer{transform:translate3d(100%,0,0)}[dir=rtl] .mat-drawer.mat-drawer-end{left:0;right:auto;transform:translate3d(-100%,0,0)}.mat-drawer.mat-drawer-opened:not(.mat-drawer-side),.mat-drawer.mat-drawer-opening:not(.mat-drawer-side){box-shadow:0 8px 10px -5px rgba(0,0,0,.2),0 16px 24px 2px rgba(0,0,0,.14),0 6px 30px 5px rgba(0,0,0,.12)}.mat-sidenav-fixed{position:fixed}"],
                    host: {
                        'class': 'mat-drawer-container',
                    },
                    changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                    encapsulation: _angular_core.ViewEncapsulation.None,
                    preserveWhitespaces: false,
                },] },
    ];
    /**
     * @nocollapse
     */
    MatDrawerContainer.ctorParameters = function () { return [
        { type: _angular_cdk_bidi.Directionality, decorators: [{ type: _angular_core.Optional },] },
        { type: _angular_core.ElementRef, },
        { type: _angular_core.Renderer2, },
        { type: _angular_core.NgZone, },
        { type: _angular_core.ChangeDetectorRef, },
    ]; };
    MatDrawerContainer.propDecorators = {
        '_drawers': [{ type: _angular_core.ContentChildren, args: [MatDrawer,] },],
        '_content': [{ type: _angular_core.ContentChild, args: [MatDrawerContent,] },],
        'backdropClick': [{ type: _angular_core.Output },],
    };
    return MatDrawerContainer;
}());

var MatSidenavContent = (function (_super) {
    __extends(MatSidenavContent, _super);
    /**
     * @param {?} changeDetectorRef
     * @param {?} container
     */
    function MatSidenavContent(changeDetectorRef, container) {
        return _super.call(this, changeDetectorRef, container) || this;
    }
    MatSidenavContent.decorators = [
        { type: _angular_core.Component, args: [{selector: 'mat-sidenav-content',
                    template: '<ng-content></ng-content>',
                    host: {
                        'class': 'mat-drawer-content mat-sidenav-content',
                        '[style.marginLeft.px]': '_margins.left',
                        '[style.marginRight.px]': '_margins.right',
                    },
                    changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                    encapsulation: _angular_core.ViewEncapsulation.None,
                    preserveWhitespaces: false,
                },] },
    ];
    /**
     * @nocollapse
     */
    MatSidenavContent.ctorParameters = function () { return [
        { type: _angular_core.ChangeDetectorRef, },
        { type: MatSidenavContainer, decorators: [{ type: _angular_core.Inject, args: [_angular_core.forwardRef(function () { return MatSidenavContainer; }),] },] },
    ]; };
    return MatSidenavContent;
}(MatDrawerContent));
var MatSidenav = (function (_super) {
    __extends(MatSidenav, _super);
    function MatSidenav() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._fixedInViewport = false;
        _this._fixedTopGap = 0;
        _this._fixedBottomGap = 0;
        return _this;
    }
    Object.defineProperty(MatSidenav.prototype, "fixedInViewport", {
        /**
         * Whether the sidenav is fixed in the viewport.
         * @return {?}
         */
        get: function () { return this._fixedInViewport; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._fixedInViewport = _angular_cdk_coercion.coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatSidenav.prototype, "fixedTopGap", {
        /**
         * The gap between the top of the sidenav and the top of the viewport when the sidenav is in fixed
         * mode.
         * @return {?}
         */
        get: function () { return this._fixedTopGap; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._fixedTopGap = _angular_cdk_coercion.coerceNumberProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatSidenav.prototype, "fixedBottomGap", {
        /**
         * The gap between the bottom of the sidenav and the bottom of the viewport when the sidenav is in
         * fixed mode.
         * @return {?}
         */
        get: function () { return this._fixedBottomGap; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { this._fixedBottomGap = _angular_cdk_coercion.coerceNumberProperty(value); },
        enumerable: true,
        configurable: true
    });
    MatSidenav.decorators = [
        { type: _angular_core.Component, args: [{selector: 'mat-sidenav',
                    exportAs: 'matSidenav',
                    template: '<ng-content></ng-content>',
                    animations: [
                        _angular_animations.trigger('transform', [
                            _angular_animations.state('open, open-instant', _angular_animations.style({
                                transform: 'translate3d(0, 0, 0)',
                                visibility: 'visible',
                            })),
                            _angular_animations.state('void', _angular_animations.style({
                                visibility: 'hidden',
                            })),
                            _angular_animations.transition('void => open-instant', _angular_animations.animate('0ms')),
                            _angular_animations.transition('void <=> open, open-instant => void', _angular_animations.animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'))
                        ])
                    ],
                    host: {
                        'class': 'mat-drawer mat-sidenav',
                        'tabIndex': '-1',
                        '[@transform]': '_animationState',
                        '(@transform.start)': '_onAnimationStart($event)',
                        '(@transform.done)': '_onAnimationEnd($event)',
                        '(keydown)': 'handleKeydown($event)',
                        // must prevent the browser from aligning text based on value
                        '[attr.align]': 'null',
                        '[class.mat-drawer-end]': 'position === "end"',
                        '[class.mat-drawer-over]': 'mode === "over"',
                        '[class.mat-drawer-push]': 'mode === "push"',
                        '[class.mat-drawer-side]': 'mode === "side"',
                        '[class.mat-sidenav-fixed]': 'fixedInViewport',
                        '[style.top.px]': 'fixedInViewport ? fixedTopGap : null',
                        '[style.bottom.px]': 'fixedInViewport ? fixedBottomGap : null',
                    },
                    changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                    encapsulation: _angular_core.ViewEncapsulation.None,
                    preserveWhitespaces: false,
                },] },
    ];
    /**
     * @nocollapse
     */
    MatSidenav.ctorParameters = function () { return []; };
    MatSidenav.propDecorators = {
        'fixedInViewport': [{ type: _angular_core.Input },],
        'fixedTopGap': [{ type: _angular_core.Input },],
        'fixedBottomGap': [{ type: _angular_core.Input },],
    };
    return MatSidenav;
}(MatDrawer));
var MatSidenavContainer = (function (_super) {
    __extends(MatSidenavContainer, _super);
    function MatSidenavContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MatSidenavContainer.decorators = [
        { type: _angular_core.Component, args: [{selector: 'mat-sidenav-container',
                    exportAs: 'matSidenavContainer',
                    template: "<div class=\"mat-drawer-backdrop\" (click)=\"_onBackdropClicked()\" [class.mat-drawer-shown]=\"_isShowingBackdrop()\"></div><ng-content select=\"mat-sidenav\"></ng-content><ng-content select=\"mat-sidenav-content\"></ng-content><mat-sidenav-content *ngIf=\"!_content\" cdkScrollable><ng-content></ng-content></mat-sidenav-content>",
                    styles: [".mat-drawer-container{position:relative;z-index:1;box-sizing:border-box;-webkit-overflow-scrolling:touch;display:block;overflow:hidden}.mat-drawer-container[fullscreen]{top:0;left:0;right:0;bottom:0;position:absolute}.mat-drawer-container[fullscreen].mat-drawer-opened{overflow:hidden}.mat-drawer-backdrop{top:0;left:0;right:0;bottom:0;position:absolute;display:block;z-index:3;visibility:hidden}.mat-drawer-backdrop.mat-drawer-shown{visibility:visible}.mat-drawer-transition .mat-drawer-backdrop{transition-duration:.4s;transition-timing-function:cubic-bezier(.25,.8,.25,1);transition-property:background-color,visibility}@media screen and (-ms-high-contrast:active){.mat-drawer-backdrop{opacity:.5}}.mat-drawer-content{-webkit-backface-visibility:hidden;backface-visibility:hidden;position:relative;z-index:1;display:block;height:100%;overflow:auto}.mat-drawer-transition .mat-drawer-content{transition-duration:.4s;transition-timing-function:cubic-bezier(.25,.8,.25,1);transition-property:transform,margin-left,margin-right}.mat-drawer{position:relative;z-index:4;display:block;position:absolute;top:0;bottom:0;z-index:3;min-width:5vw;outline:0;box-sizing:border-box;overflow-y:auto;transform:translate3d(-100%,0,0)}.mat-drawer.mat-drawer-side{z-index:2}.mat-drawer.mat-drawer-end{right:0;transform:translate3d(100%,0,0)}[dir=rtl] .mat-drawer{transform:translate3d(100%,0,0)}[dir=rtl] .mat-drawer.mat-drawer-end{left:0;right:auto;transform:translate3d(-100%,0,0)}.mat-drawer.mat-drawer-opened:not(.mat-drawer-side),.mat-drawer.mat-drawer-opening:not(.mat-drawer-side){box-shadow:0 8px 10px -5px rgba(0,0,0,.2),0 16px 24px 2px rgba(0,0,0,.14),0 6px 30px 5px rgba(0,0,0,.12)}.mat-sidenav-fixed{position:fixed}"],
                    host: {
                        'class': 'mat-drawer-container mat-sidenav-container',
                    },
                    changeDetection: _angular_core.ChangeDetectionStrategy.OnPush,
                    encapsulation: _angular_core.ViewEncapsulation.None,
                    preserveWhitespaces: false,
                },] },
    ];
    /**
     * @nocollapse
     */
    MatSidenavContainer.ctorParameters = function () { return []; };
    MatSidenavContainer.propDecorators = {
        '_drawers': [{ type: _angular_core.ContentChildren, args: [MatSidenav,] },],
        '_content': [{ type: _angular_core.ContentChild, args: [MatSidenavContent,] },],
    };
    return MatSidenavContainer;
}(MatDrawerContainer));

var MatSidenavModule = (function () {
    function MatSidenavModule() {
    }
    MatSidenavModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    imports: [
                        _angular_common.CommonModule,
                        _angular_material_core.MatCommonModule,
                        _angular_cdk_a11y.A11yModule,
                        _angular_cdk_overlay.OverlayModule,
                        _angular_cdk_scrolling.ScrollDispatchModule,
                    ],
                    exports: [
                        _angular_material_core.MatCommonModule,
                        MatDrawer,
                        MatDrawerContainer,
                        MatDrawerContent,
                        MatSidenav,
                        MatSidenavContainer,
                        MatSidenavContent,
                    ],
                    declarations: [
                        MatDrawer,
                        MatDrawerContainer,
                        MatDrawerContent,
                        MatSidenav,
                        MatSidenavContainer,
                        MatSidenavContent,
                    ],
                },] },
    ];
    /**
     * @nocollapse
     */
    MatSidenavModule.ctorParameters = function () { return []; };
    return MatSidenavModule;
}());

exports.MatSidenavModule = MatSidenavModule;
exports.throwMatDuplicatedDrawerError = throwMatDuplicatedDrawerError;
exports.MatDrawerToggleResult = MatDrawerToggleResult;
exports.MatDrawerContent = MatDrawerContent;
exports.MatDrawer = MatDrawer;
exports.MatDrawerContainer = MatDrawerContainer;
exports.MatSidenavContent = MatSidenavContent;
exports.MatSidenav = MatSidenav;
exports.MatSidenavContainer = MatSidenavContainer;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material-sidenav.umd.js.map
