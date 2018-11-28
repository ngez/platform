import { 
    Component, 
    Input, 
    Output,
    EventEmitter, 
    HostListener, 
    HostBinding, 
    ElementRef } from "@angular/core";
import { Highlightable } from "@angular/cdk/a11y";

@Component({
    selector: 'ngez-option',
    templateUrl: './option.component.html',
    styleUrls: ['./option.component.scss']
})
export class NgEzOptionComponent implements Highlightable {

    @Input() value: any;

    @Input() @HostBinding('class.disabled') disabled = false;

    @Output() selected = new EventEmitter();

    @HostBinding('class.active') active = false;

    constructor(private element: ElementRef){}

    setActiveStyles() {
        this.active = true;
    };

    setInactiveStyles() {
        this.active = false;
    }

    @HostListener('click')
    onSelect() {
        if(!this.disabled)
            this.selected.emit(this);
    }

    getOffsetTop(){
        const element = this.element.nativeElement as HTMLElement;
        return element.offsetTop;
    }

    getOffsetHeight(){
        const element = this.element.nativeElement as HTMLElement;
        return element.getBoundingClientRect().height;
    }

    scrollIntoView(scroll){
        const element = this.element.nativeElement as HTMLElement;
        element.scrollIntoView(scroll);
    }

    getBoundingClientRect(){
        const element = this.element.nativeElement as HTMLElement;
        return element.getBoundingClientRect();
    }
}