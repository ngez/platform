import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ClipboardPage } from "./clipboard.page";
import { FlexLayoutModule } from "@angular/flex-layout";
import { CommonModule } from "@angular/common";
import { NgEzCodePrettifyModule } from '@ngez/core';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgEzClipboardModule } from '@ngez/core';
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const routes : Routes = [{
    path: '',
    component: ClipboardPage
}];

@NgModule({
    imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
        MatButtonModule,
        MatInputModule,
        NgEzCodePrettifyModule,
        MatProgressSpinnerModule,
        FlexLayoutModule,
        RouterModule.forChild(routes),
        CommonModule,
        NgEzClipboardModule],
    declarations: [ClipboardPage]
})
export class ClipboardModule{}