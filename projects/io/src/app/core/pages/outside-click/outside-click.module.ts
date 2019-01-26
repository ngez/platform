import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { OutsideClickPage } from "./outside-click.page";
import { FlexLayoutModule } from "@angular/flex-layout";
import { CommonModule } from "@angular/common";
import { NgEzCodePrettifyModule, NgEzOutsideClickModule } from '@ngez/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const routes : Routes = [{
    path: '',
    component: OutsideClickPage
}];

@NgModule({
    imports: [
        NgEzCodePrettifyModule,
        MatProgressSpinnerModule,
        FlexLayoutModule,
        RouterModule.forChild(routes),
        CommonModule,
        NgEzOutsideClickModule],
    declarations: [OutsideClickPage]
})
export class OutsideClickModule{}