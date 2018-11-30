import { NgModule } from "@angular/core";
import { NgEzNestedNavComponent } from "./nested-nav.component";
import { NgEzNavListComponent } from "./nav-list.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [CommonModule, FontAwesomeModule],
    declarations: [NgEzNestedNavComponent, NgEzNavListComponent],
    exports: [NgEzNestedNavComponent, NgEzNavListComponent]
})
export class NgEzNestedNavModule{}