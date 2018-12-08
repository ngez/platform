import {
    Directive,
    HostListener,
    Input,
    Output,
    ElementRef,
    OnInit,
    OnDestroy,
    ViewContainerRef,
    forwardRef,
    Optional,
    Inject
} from "@angular/core";
import { filter, map, take } from 'rxjs/operators';
import { Overlay, ConnectionPositionPair, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from "@angular/cdk/portal";
import { NgEzAutocompleteComponent } from "./autocomplete.component";
import { Subscription, merge, BehaviorSubject, ReplaySubject, of, fromEvent } from "rxjs";
import { ESCAPE, DOWN_ARROW, UP_ARROW, TAB } from "@angular/cdk/keycodes";
import { NgEzAutocompleteOptionComponent } from "./autocomplete-option.component";
import { EventEmitter } from "protractor";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgEzAutocompleteConfig, defaultConfig } from "./models";
import { DOCUMENT } from "@angular/common";

@Directive({
    selector: '[ngezAutocomplete]',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NgEzAutocompleteDirective),
        multi: true
    }]
})
export class NgEzAutocompleteDirective implements ControlValueAccessor, OnDestroy {

    @Input('ngezAutocomplete') autocomplete: NgEzAutocompleteComponent;

    private overlayRef: OverlayRef;

    private subscription: Subscription;

    text$ = new ReplaySubject(1);

    onChange: Function;

    onTouched: Function;

    constructor(
        private element: ElementRef,
        private overlay: Overlay,
        private viewContainerRef: ViewContainerRef,
        @Optional() @Inject(DOCUMENT) private document: any) { }

    ngOnDestroy() {
        this.overlayRef.dispose();
        this.unsubscribe();
    }

    @HostListener('input', ['$event'])
    private onValueChange(e) {
        this.text$.next(this.element.nativeElement.value)
        this.open();
    }

    @HostListener('keydown', ['$event'])
    private onKeyDown(event: KeyboardEvent) {
        const keyCode = event.keyCode;

        if (keyCode === ESCAPE) {
            event.preventDefault();
        }

        const prevActiveItem = this.autocomplete.keyboardEventsManager.activeItem;
        const isArrowKey = keyCode === UP_ARROW || keyCode === DOWN_ARROW;

        if (this.isVisible) {
            this.autocomplete.handleKeyDown(event);
            if (isArrowKey) {
                this.scrollToOption();
            }
        }

        else if (isArrowKey)
            this.open();
    }

    open() {
        if (this.isVisible)
            return;

        const positions = [
            new ConnectionPositionPair({ originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' }),
            new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' })
        ];

        const positionStrategy =
            this.overlay.position().flexibleConnectedTo(this.element)
                .withPush(true)
                .withPositions(positions);

        const { config, template } = this.autocomplete;

        this.overlayRef = this.overlay.create({
            disposeOnNavigation: true,
            hasBackdrop: false,
            scrollStrategy: this.overlay.scrollStrategies.close(),
            positionStrategy: positionStrategy,
            width: this.element.nativeElement.offsetWidth,
            maxHeight: config && config.maxHeight 
                ? config.maxHeight 
                : defaultConfig.maxHeight 
        });

        const autocompletePortal =
            new TemplatePortal(template, this.viewContainerRef);

        this.overlayRef.attach(autocompletePortal);

        this.subscription =
            this.getAutocompleteClosingActions().subscribe(event => {
                this.setValueAndClose(event);
            });
        this.autocomplete.opened.emit();
    }

    close() {
        if (!this.isVisible)
            return;

        this.autocomplete.closed.emit();
        this.autocomplete.reset();
        this.overlayRef.detach();
        this.unsubscribe();
    }

    writeValue(value: any): void {
        this.setValue(value);
    }

    // Implemented as part of ControlValueAccessor.
    registerOnChange(fn: (value: any) => {}): void {
        this.onChange = fn;
    }

    // Implemented as part of ControlValueAccessor.
    registerOnTouched(fn: () => {}) {
        this.onTouched = fn;
    }

    // Implemented as part of ControlValueAccessor.
    setDisabledState(isDisabled: boolean) {
        this.element.nativeElement.disabled = isDisabled;
    }

    private setValue(value: any) {
        const { config } = this.autocomplete;
        const text = value != null && config && config.labelExtractor
            ? config.labelExtractor(value)
            : value;

        this.element.nativeElement.value = text;
    }

    get isVisible() {
        return this.overlayRef ? this.overlayRef.hasAttached() : false;
    }

    private scrollToOption(){
        this.autocomplete.setScrollTop();
    }

    private getAutocompleteClosingActions() {
        return merge(
            ...this.autocomplete.options.map(option => option.selected),
            this.getOutsideClickStream(),
            this.autocomplete.keyboardEventsManager.tabOut,
            this.overlayRef.keydownEvents().pipe(filter(event => event.keyCode === ESCAPE))
        ).pipe(
            map(event => event instanceof NgEzAutocompleteOptionComponent ? event : null)
        );
    }

    private getOutsideClickStream() {
        if (!this.document)
            return of(null);
        return fromEvent<MouseEvent>(this.document, 'click')
            .pipe(
                filter(event => {
                    const clickTarget = event.target as HTMLElement;
                    return clickTarget !== this.element.nativeElement &&
                        (!!this.overlayRef && !this.overlayRef.overlayElement.contains(clickTarget));
                })
            )
    }

    private setValueAndClose(event: NgEzAutocompleteOptionComponent) {
        if (event) {
            this.element.nativeElement.focus();
            this.setValue(event.value);
            this.onChange(event.value);
        }
        this.close();
    }

    private unsubscribe() {
        if (this.subscription)
            this.subscription.unsubscribe();
    }
}