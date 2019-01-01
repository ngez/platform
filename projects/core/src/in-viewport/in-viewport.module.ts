import { NgModule } from "@angular/core";
import { NgEzInViewportDirective } from "./in-viewport.directive";
import { WINDOW_PROVIDERS } from "../window";

@NgModule({
    declarations: [NgEzInViewportDirective],
    providers: [WINDOW_PROVIDERS],
    exports: [NgEzInViewportDirective]
})
export class NgEzInViewportModule{}