import { Directive, HostListener, Output, EventEmitter } from "@angular/core";

@Directive({
    selector: '[ngezReload]'
})
export class NgEzReloadDirective{

    @Output() reload = new EventEmitter();

    @HostListener('click')
    private onClick(){
        this.reload.emit();
    }
}