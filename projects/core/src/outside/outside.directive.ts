import { Directive, ElementRef, Optional, Inject, Input, Output, EventEmitter, OnInit, OnDestroy } from "@angular/core";
import { fromEvent, Subscription } from "rxjs";
import { DOCUMENT } from "@angular/common";
import { filter } from "rxjs/operators";

@Directive({
    selector: '[ngezOutside]'
})
export class NgEzOutsideDirective implements OnInit, OnDestroy {

    @Output() outsideClick = new EventEmitter<MouseEvent>();

    private _elements: HTMLElement[];

    private subscription: Subscription;

    @Input() set ignore(elements: HTMLElement | HTMLElement[]) {
        this._elements = Array.isArray(elements)
            ? elements
            : [elements];
    }

    constructor(
        private element: ElementRef,
        @Optional() @Inject(DOCUMENT) private document: any) { }

    ngOnInit() {
        this.subscription = fromEvent<MouseEvent>(this.document, 'click')
            .pipe(
                filter(event => {
                    const clickTarget = event.target as HTMLElement;
                    return clickTarget !== this.element.nativeElement &&
                        (this._elements ? this._elements.every(element => element != clickTarget && !element.contains(clickTarget)) : true);
                })
            )
            .subscribe(event => this.outsideClick.emit(event));
    }

    ngOnDestroy() {
        if(this.subscription)
            this.subscription.unsubscribe();
    }
}