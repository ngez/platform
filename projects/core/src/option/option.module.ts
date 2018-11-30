import { NgModule } from "@angular/core";
import { NgEzOptionComponent } from "./option.component";
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [CommonModule],
    declarations: [NgEzOptionComponent],
    exports: [NgEzOptionComponent]
})
export class NgEzOptionModule{}