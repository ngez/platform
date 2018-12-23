import { Directive, Input, Output, EventEmitter, HostListener } from "@angular/core";
import { NgEzClipboardService } from "./clipboard.service";

@Directive({ selector: '[ngezClipboard]' })
export class NgEzClipboardDirective {

    @Input("ngezClipboard")  payload: string;

    @Output() copy = new EventEmitter<string>();

    constructor(private clipboard: NgEzClipboardService){}

    @HostListener("click", ["$event"])
    public onClick(event: MouseEvent): void {

        event.preventDefault();

        if (!this.payload)
            return;

        this.clipboard.copy(this.payload);
    }
}