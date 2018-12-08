import { NgModule } from "@angular/core";
import { NgEzCopyClipboardDirective } from "./copy-clipboard.directive";

@NgModule({
    declarations: [NgEzCopyClipboardDirective],
    exports: [NgEzCopyClipboardDirective]
})
export class NgEzCopyClipboardModule{}