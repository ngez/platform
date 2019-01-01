import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LazyImagePage } from "./lazy-image.page";
import { FlexLayoutModule } from "@angular/flex-layout";
import { CommonModule } from "@angular/common";
import { NgEzCodePrettifyModule } from '@ngez/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgEzLazyLoadModule } from "../../../../../../core/src/lazy-load";
import { NgEzInViewportModule } from "../../../../../../core/src/in-viewport";

const routes : Routes = [{
    path: '',
    component: LazyImagePage
}];

@NgModule({
    imports: [
        NgEzCodePrettifyModule,
        MatProgressSpinnerModule,
        FlexLayoutModule,
        RouterModule.forChild(routes), 
        NgEzLazyLoadModule, 
        NgEzInViewportModule,
        CommonModule],
    declarations: [LazyImagePage]
})
export class LazyImageModule{}