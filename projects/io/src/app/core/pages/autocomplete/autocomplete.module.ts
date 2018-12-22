import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AutocompletePage } from "./autocomplete.page";
import { FlexLayoutModule } from "@angular/flex-layout";
// import { NgEzAutocompleteModule } from "@ngez/core";
import { NgEzAutocompleteModule } from "../../../../../../core/src/autocomplete";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { NgEzCodePrettifyModule } from '@ngez/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const routes : Routes = [{
    path: '',
    component: AutocompletePage
}];

@NgModule({
    imports: [
        NgEzCodePrettifyModule,
        MatProgressSpinnerModule,
        FlexLayoutModule, 
        ReactiveFormsModule, 
        RouterModule.forChild(routes), 
        NgEzAutocompleteModule, 
        CommonModule],
    declarations: [AutocompletePage]
})
export class AutocompleteModule{}