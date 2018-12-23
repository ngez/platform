import { Component } from "@angular/core";
import { NgEzClipboardService } from "@ngez/core";

@Component({
    selector: 'app',
    templateUrl: './app.component.html'
})
export class AppComponent {

    constructor(private clipboard: NgEzClipboardService) {}

    onCopy() {
        const didCopy = this.clipboard.copy('This will be copied to clipboard');
        console.log(didCopy);
    }
}