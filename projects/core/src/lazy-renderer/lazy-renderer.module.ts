import { NgModule } from "@angular/core";
import { NgEzLazyRendererComponent } from "./lazy-renderer.component";
import { NgEzInViewportModule } from "../in-viewport/in-viewport.module";
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [NgEzInViewportModule, CommonModule],
    declarations: [NgEzLazyRendererComponent],
    exports: [NgEzLazyRendererComponent]
})
export class NgEzLazyRendererModule{}