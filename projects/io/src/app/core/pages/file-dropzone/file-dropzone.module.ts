import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FileDropzonePage } from "./file-dropzone.page";
import { FlexLayoutModule } from "@angular/flex-layout";
import { CommonModule } from "@angular/common";
import { NgEzCodePrettifyModule, NgEzFileModule } from '@ngez/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from '@angular/material';

const routes : Routes = [{
    path: '',
    component: FileDropzonePage
}];

@NgModule({
    imports: [
        NgEzCodePrettifyModule,
        MatProgressSpinnerModule,
        FlexLayoutModule,
        RouterModule.forChild(routes),
        CommonModule,
        NgEzFileModule,
        MatButtonModule,
        ReactiveFormsModule],
    declarations: [FileDropzonePage]
})
export class FileDropzoneModule{}