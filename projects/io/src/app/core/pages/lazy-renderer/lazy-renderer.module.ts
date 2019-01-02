import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LazyRendererPage } from "./lazy-renderer.page";
import { FlexLayoutModule } from "@angular/flex-layout";
import { CommonModule } from "@angular/common";
import { NgEzCodePrettifyModule, NgEzLazyRendererModule } from '@ngez/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgEzInViewportModule } from "../../../../../../core/src/in-viewport";
import { TestComponent } from "./test.component";

const routes : Routes = [{
    path: '',
    component: LazyRendererPage
}];

@NgModule({
    imports: [
        NgEzCodePrettifyModule,
        MatProgressSpinnerModule,
        FlexLayoutModule,
        RouterModule.forChild(routes), 
        NgEzLazyRendererModule, 
        NgEzInViewportModule,
        CommonModule],
    declarations: [LazyRendererPage, TestComponent]
})
export class LazyRendererModule{}