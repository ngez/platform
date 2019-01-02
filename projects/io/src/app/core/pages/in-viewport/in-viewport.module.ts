
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { InViewportPage } from "./in-viewport.page";
import { FlexLayoutModule } from "@angular/flex-layout";
import { CommonModule } from "@angular/common";
import { NgEzCodePrettifyModule, NgEzInViewportModule } from '@ngez/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const routes : Routes = [{
    path: '',
    component: InViewportPage
}];

@NgModule({
    imports: [
        NgEzCodePrettifyModule,
        MatProgressSpinnerModule,
        FlexLayoutModule,
        RouterModule.forChild(routes),
        CommonModule,
        NgEzInViewportModule],
    declarations: [InViewportPage]
})
export class InViewportModule{}