import { NgModule } from "@angular/core";
import { NgEzFileInputDirective } from "./file-input.directive";
import { NgEzBytesPipe } from "./bytes.pipe";

@NgModule({
    declarations: [NgEzFileInputDirective, NgEzBytesPipe],
    exports: [NgEzFileInputDirective, NgEzBytesPipe]
})
export class NgEzFileModule{}