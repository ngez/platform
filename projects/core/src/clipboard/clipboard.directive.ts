import { Directive, Input, Output, EventEmitter, HostListener } from "@angular/core";
import { NgEzClipboardService } from "./clipboard.service";

@Directive({ selector: '[ngezClipboard]' })
export class NgEzClipboardDirective {

    @Input("ngezClipboard")  payload: string;

    @Output() copy = new EventEmitter<boolean>();

    constructor(private clipboard: NgEzClipboardService){}

    @HostListener("click", ["$event"])
    public onClick(event: MouseEvent): void {
        if (!this.payload)
            return;

        this.copy.emit(this.clipboard.copy(this.payload));
    }
}