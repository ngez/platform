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
import { ESCAPE } from "@angular/cdk/keycodes";
import { NgEzOptionComponent } from "../option";
import { EventEmitter } from "protractor";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgEzAutocompleteConfig } from "./models";
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

    @Input() config: NgEzAutocompleteConfig;

    private overlayRef: OverlayRef;

    private subscription: Subscription;

    text$ = new ReplaySubject(1);

    onChange: Function;

    onTouched: Function;

    constructor(
        private element: ElementRef,
        private overlay: Overlay,
        private viewContainerRef: ViewContainerRef,
        @Optional() @Inject(DOCUMENT) private document: HTMLDocument) { }

    ngOnDestroy() {
        this.overlayRef.dispose();
        this.unsubscribe();
    }

    @HostListener('input', ['$event'])
    onValueChange(e) {
        this.text$.next(this.element.nativeElement.value)
        this.open();
    }

    @HostListener('keyup', ['$event'])
    onKeyUp(e: KeyboardEvent) {
        if (this.isVisible)
            this.autocomplete.handleKeyUp(e);
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

        this.overlayRef = this.overlay.create({
            disposeOnNavigation: true,
            hasBackdrop: false,
            scrollStrategy: this.overlay.scrollStrategies.close(),
            positionStrategy: positionStrategy,
            width: this.element.nativeElement.offsetWidth
        });

        const autocompletePortal =
            new TemplatePortal(this.autocomplete.template, this.viewContainerRef);

        this.overlayRef.attach(autocompletePortal);

        this.subscription =
            this.getAutocompleteClosingActions().subscribe(event => {
                this.setValueAndClose(event);
            })
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

    setValue(value: any) {
        const text = this.config && this.config.labelExtractor
            ? this.config.labelExtractor(value)
            : value;

        this.element.nativeElement.value = text;
    }

    get isVisible() {
        return this.overlayRef ? this.overlayRef.hasAttached() : false;
    }

    private getAutocompleteClosingActions() {
        return merge(
            ...this.autocomplete.options.map(option => option.selected),
            this.getOutsideClickStream(),
            this.overlayRef.keydownEvents().pipe(filter(event => event.keyCode === ESCAPE))
        ).pipe(
            map(event => event instanceof NgEzOptionComponent ? event : null)
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

    private setValueAndClose(event: NgEzOptionComponent) {
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