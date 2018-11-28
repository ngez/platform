import { Directive, ElementRef, Optional, Inject, Input } from "@angular/core";
import { fromEvent } from "rxjs";
import { DOCUMENT } from "@angular/common";
import { filter } from "rxjs/operators";

@Directive({
    selector: '[ngezOutside]'
})
export class NgEzOutsideDirective {

    private _elements: HTMLElement[]

    @Input() set ignore(elements: HTMLElement | HTMLElement[]) {
        this._elements = Array.isArray(elements)
            ? elements
            : [elements];
    }

    constructor(
        private element: ElementRef,
        @Optional() @Inject(DOCUMENT) private document: any) { }

    ngOnInit() {
        fromEvent<MouseEvent>(this.document, 'click')
            .pipe(
                filter(event => {
                    const clickTarget = event.target as HTMLElement;
                    return clickTarget !== this.element.nativeElement && 
                        (this._elements ? this._elements.every(element => element != clickTarget && !element.contains(clickTarget)) : true);
                })
            )
            .subscribe(event => {
                console.log(event)

            })
    }
}