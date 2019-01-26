import { NgModule } from "@angular/core";
import { NgEzBytesPipe } from "./bytes.pipe";

@NgModule({
    declarations: [NgEzBytesPipe],
    exports: [NgEzBytesPipe]
})
export class NgEzBytesModule{}