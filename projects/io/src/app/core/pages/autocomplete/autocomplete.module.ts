import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AutocompletePage } from "./autocomplete.page";
import { FlexLayoutModule } from "@angular/flex-layout";

const routes : Routes = [{
    path: '',
    component: AutocompletePage
}];

@NgModule({
    imports: [FlexLayoutModule, RouterModule.forChild(routes)],
    declarations: [AutocompletePage]
})
export class AutocompleteModule{}