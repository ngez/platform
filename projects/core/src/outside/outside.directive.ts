import { Directive, ElementRef, Optional, Inject, Input, Output, EventEmitter, OnInit, OnDestroy, PLATFORM_ID } from "@angular/core";
import { fromEvent, Subscription } from "rxjs";
import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import { filter } from "rxjs/operators";

@Directive({
    selector: '[ngezOutsideClick]'
})
export class NgEzOutsideDirective implements OnInit, OnDestroy {

    @Output('ngezOutsideClick') outsideClick = new EventEmitter<MouseEvent>();

    private subscription: Subscription;

    constructor(
        private element: ElementRef,
        @Optional() @Inject(DOCUMENT) private document: any,
        @Inject(PLATFORM_ID) private platformId: Object) { }

    ngOnInit() {
        if(!isPlatformBrowser(this.platformId)) return;
        
        setTimeout(() => {
            this.subscription = fromEvent<MouseEvent>(this.document, 'click')
            .pipe(
                filter(event => {
                    const clickTarget = event.target as HTMLElement;
                    return !this.isOrContainsClickTarget(this.element.nativeElement, clickTarget);
                })
            )
            .subscribe(event => this.outsideClick.emit(event));
        }, 0);
    }

    ngOnDestroy() {
        if(this.subscription)
            this.subscription.unsubscribe();
    }

    private isOrContainsClickTarget(element: HTMLElement, clickTarget: HTMLElement){
        return element == clickTarget || element.contains(clickTarget);
    }
}