import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { OutsidePage } from "./outside.page";
import { FlexLayoutModule } from "@angular/flex-layout";
import { CommonModule } from "@angular/common";
import { NgEzCodePrettifyModule } from '@ngez/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgEzOutsideModule } from '@ngez/core';

const routes : Routes = [{
    path: '',
    component: OutsidePage
}];

@NgModule({
    imports: [
        NgEzCodePrettifyModule,
        MatProgressSpinnerModule,
        FlexLayoutModule,
        RouterModule.forChild(routes),
        CommonModule,
        NgEzOutsideModule],
    declarations: [OutsidePage]
})
export class OutsideModule{}