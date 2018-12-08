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
    selector: 'ngez-autocomplete-option',
    templateUrl: './autocomplete-option.component.html',
    styleUrls: ['./autocomplete-option.component.scss']
})
export class NgEzAutocompleteOptionComponent implements Highlightable {

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

    getOffsetHeight(){
        const element = this.element.nativeElement as HTMLElement;
        return element.getBoundingClientRect().height;
    }
}