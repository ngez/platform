import { Directive, HostListener, Input, Output, ElementRef, OnInit, OnDestroy, ViewContainerRef } from "@angular/core";
import { debounceTime } from 'rxjs/operators';
import { Overlay, ConnectionPositionPair, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from "@angular/cdk/portal";
import { AutocompleteComponent } from "./autocomplete.component";
import { Subscription } from "rxjs";

@Directive({
    selector: '[ngezAutocomplete]'
})
export class AutocompleteDirective implements OnDestroy{

    @Input('ngezAutocomplete') autocomplete: AutocompleteComponent; 

    @Input() debounce: number = 0;

    private overlayRef: OverlayRef;

    private subscription: Subscription;

    constructor(private el: ElementRef, private overlay: Overlay, private viewContainerRef: ViewContainerRef) {
        console.log(this.el)
        //this.el.nativeElement.setAttribute('value', 'dsfsdf')
    }

    ngOnDestroy(){
        this.unsubscribe();
    }

    @HostListener('input', ['$event'])
    onValueChange(e) {
        this.open()
    }

    open(){

        if(this.overlayRef && this.overlayRef.hasAttached())
            return;

        const positions = [
            new ConnectionPositionPair({ originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' }),
            new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' })
        ];

        const positionStrategy =
            this.overlay.position().flexibleConnectedTo(this.el)
                .withPush(true)
                .withPositions(positions);

        this.overlayRef = this.overlay.create({
            disposeOnNavigation: true,
            hasBackdrop: true,
            scrollStrategy: this.overlay.scrollStrategies.close(),
            positionStrategy: positionStrategy,
            width: this.el.nativeElement.offsetWidth,
            maxHeight: 100
        });

        this.subscription = 
            this.overlayRef.backdropClick().subscribe(() => this.close());

        const autocompletePortal = 
            new TemplatePortal(this.autocomplete.template, this.viewContainerRef);
        
        this.overlayRef.attach(autocompletePortal);
    }

    close() {
        this.overlayRef.dispose();
        this.unsubscribe();
    }

    unsubscribe(){
        if(this.subscription)
            this.subscription.unsubscribe();
    }
}