import { NgModule } from "@angular/core";
import { NgEzLazyLoadComponent } from "./lazy-load.component";
import { NgEzInViewportModule } from "../in-viewport";
import { CommonModule } from "@angular/common";
import { TestComponent } from "./test";

@NgModule({
    imports: [NgEzInViewportModule, CommonModule],
    declarations: [NgEzLazyLoadComponent, TestComponent],
    exports: [NgEzLazyLoadComponent]
})
export class NgEzLazyLoadModule{}