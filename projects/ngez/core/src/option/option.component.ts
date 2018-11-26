import { Component, Input, Output, EventEmitter, HostListener, HostBinding } from "@angular/core";
import { ListKeyManagerOption, Highlightable } from "@angular/cdk/a11y";

@Component({
    selector: 'ngez-option',
    templateUrl: './option.component.html',
    styleUrls: ['./option.component.scss']
})
export class NgEzOptionComponent implements ListKeyManagerOption, Highlightable {

    @Input() value: any;

    @Input() @HostBinding('class.disabled') disabled = false;

    @Output() selected = new EventEmitter();

    @HostBinding('class.active') isActive = false;

    setActiveStyles() {
        this.isActive = true;
    };

    setInactiveStyles() {
        this.isActive = false;
    }

    @HostListener('click')
    onSelect() {
        if(!this.disabled)
            this.selected.emit(this);
    }
}