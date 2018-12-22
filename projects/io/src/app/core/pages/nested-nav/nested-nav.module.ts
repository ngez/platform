import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NestedNavPage } from "./nested-nav.page";
import { FlexLayoutModule } from "@angular/flex-layout";
import { CommonModule } from "@angular/common";
import { NgEzCodePrettifyModule } from '@ngez/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgEzNestedNavModule } from '@ngez/core';

const routes : Routes = [{
    path: '',
    component: NestedNavPage
}];

@NgModule({
    imports: [
        NgEzCodePrettifyModule,
        MatProgressSpinnerModule,
        FlexLayoutModule,
        RouterModule.forChild(routes),
        CommonModule,
        NgEzNestedNavModule],
    declarations: [NestedNavPage]
})
export class NestedNavModule{}