
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FileInputPage } from "./file-input.page";
import { FlexLayoutModule } from "@angular/flex-layout";
import { CommonModule } from "@angular/common";
import { NgEzCodePrettifyModule, NgEzFileModule } from '@ngez/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgEzFormsModule } from "../../../../../../core/src/forms";

const routes : Routes = [{
    path: '',
    component: FileInputPage
}];

@NgModule({
    imports: [
        NgEzCodePrettifyModule,
        MatProgressSpinnerModule,
        FlexLayoutModule,
        RouterModule.forChild(routes),
        CommonModule,
        NgEzFileModule,
        ReactiveFormsModule,
        FormsModule,
        NgEzFormsModule],
    declarations: [FileInputPage]
})
export class FileInputModule{}