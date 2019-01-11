
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FormsPage } from "./forms.page";
import { FlexLayoutModule } from "@angular/flex-layout";
import { CommonModule } from "@angular/common";
import { NgEzCodePrettifyModule } from '@ngez/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const routes : Routes = [{
    path: '',
    component: FormsPage
}];

@NgModule({
    imports: [
        NgEzCodePrettifyModule,
        MatProgressSpinnerModule,
        FlexLayoutModule,
        RouterModule.forChild(routes),
        CommonModule],
    declarations: [FormsPage]
})
export class FormsModule{}