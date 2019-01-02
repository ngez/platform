import { 
    Directive, 
    ElementRef, 
    Inject, 
    PLATFORM_ID, 
    Optional, 
    OnInit, 
    Input, 
    TemplateRef, 
    OnDestroy, 
    Output,
    EventEmitter } from "@angular/core";
import { WINDOW } from "../window";
import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import { NgEzInViewportConfig, defaultConfig, defaultOffsetConfig, NgEzInViewportEvent } from "./models";
import { fromEvent, merge, Subscription, of } from "rxjs";

@Directive({
    selector: '[ngezInViewport]',
    exportAs: 'ngezInViewport'
})
export class NgEzInViewportDirective implements OnInit, OnDestroy{

    @Input() set config(config: NgEzInViewportConfig){
        this._config = config;
    }

    @Output() inViewportChange = new EventEmitter<NgEzInViewportEvent>();

    private _config: NgEzInViewportConfig;

    private container: Element;

    private subscription: Subscription;

    private latest: NgEzInViewportEvent = {
        top: false,
        bottom: false,
        left: false,
        right: false,
        all: false,
        any: false
    };

    constructor(
        private element: ElementRef,
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(WINDOW) private window: any,
        @Optional() @Inject(DOCUMENT) private document: any){}

    ngOnInit() {
        if(!isPlatformBrowser(this.platformId)) return;

        this.container = this.getClosestScrollableParent(this.element.nativeElement);
        
        //Check on scroll, window resize and oninit
        this.subscription = merge(
            fromEvent(this.isDocumentTheScrollableContainer() ? this.document : this.container, 'scroll'), 
            fromEvent(this.window, 'resize'),
            of(null))
                .subscribe(() => this.checkVisibility());
    }

    ngOnDestroy() {
        if(this.subscription)
            this.subscription.unsubscribe();
    }


    get config(): NgEzInViewportConfig {
        const { offset = {}, ...config } = this._config || {};

        return { 
            ...defaultConfig, 
            ...config, 
            offset: {
                ...defaultOffsetConfig,
                ...offset
            }
        };
    }

    checkVisibility(){
        const previous = this.latest;
        const current = this.calculateVisibility();
        // console.log(previous, current)

        const hasChanged = previous.top != current.top
            || previous.bottom != current.bottom
            || previous.left != current.left
            || previous.right != current.right;

        if(hasChanged)
            this.inViewportChange.emit(current);

        this.latest = current;
    }

    private calculateVisibility(): NgEzInViewportEvent{
        const elementRect = this.element.nativeElement.getBoundingClientRect();
        
        const height = elementRect.height;
        const width =  elementRect.width;

        const containerRect = this.container.getBoundingClientRect();

        const top = elementRect.top - (this.isDocumentTheScrollableContainer()
            ? 0
            : containerRect.top);

        const bottom = top + height;

        const left = elementRect.left - (this.isDocumentTheScrollableContainer()
            ? 0
            : containerRect.left);

        const right = left + width;

        const containerHeight = this.container.clientHeight || this.window.innerHeight;
        const containerWidth = this.container.clientWidth || this.window.innerWidth;

        const topInView = top + this.config.offset.top >= 0 && top <= (containerHeight + this.config.offset.top);
        const bottomInView = bottom + this.config.offset.bottom >= 0 && bottom <= (containerHeight + this.config.offset.bottom);
        const leftInView = left + this.config.offset.left >= 0 && left <= (containerWidth + this.config.offset.left);
        const rightInView = right + this.config.offset.right >= 0 && right <= (containerWidth + this.config.offset.right);

        return {
            top: topInView,
            bottom: bottomInView,
            left: leftInView && (topInView || bottomInView),
            right: rightInView && (topInView || bottomInView),
            any: (topInView || bottomInView) && (leftInView || rightInView),
            all: topInView && bottomInView && leftInView && rightInView
        };
    }

    private getClosestScrollableParent(node: Node) {
        return !node || node === this.document.body
            ? document.documentElement
            : this.isScrollable(node)
                ? node 
                : this.getClosestScrollableParent(node.parentNode);
    }

    private isScrollable(node: Node){
        const regex = /(auto|scroll)/;
        return regex.test(
            this.getComputedStyle(node, 'overflow') +
            this.getComputedStyle(node, 'overflow-y') +
            this.getComputedStyle(node, 'overflow-x'));
    }

    private getComputedStyle(node: Node, style: string){
        return this.window.getComputedStyle(node).getPropertyValue(style);
    }

    private isDocumentTheScrollableContainer(){
        return this.document.documentElement === this.container;
    }
}