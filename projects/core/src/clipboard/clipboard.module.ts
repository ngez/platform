import { NgModule } from "@angular/core";
import { WINDOW_PROVIDERS } from "../window/window.service";
import { NgEzClipboardService } from "./clipboard.service";
import { NgEzClipboardDirective } from "./clipboard.directive";

@NgModule({
    declarations: [NgEzClipboardDirective],
    providers: [NgEzClipboardService, WINDOW_PROVIDERS],
    exports: [NgEzClipboardDirective]
})
export class NgEzClipboardModule{}