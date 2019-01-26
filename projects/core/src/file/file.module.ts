import { NgModule } from "@angular/core";
import { NgEzFileInputDirective } from "./file-input.directive";
import { NgEzFileDropzoneDirective } from "./file-dropzone.directive";
import { NgEzBytesModule } from "../pipes/bytes/bytes.module";

@NgModule({
    declarations: [NgEzFileInputDirective, NgEzFileDropzoneDirective],
    exports: [NgEzFileInputDirective, NgEzFileDropzoneDirective, NgEzBytesModule]
})
export class NgEzFileModule{}