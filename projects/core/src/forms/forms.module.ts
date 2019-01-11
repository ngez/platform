import { NgModule } from "@angular/core";
import { NgEzUrlValidator } from "./url.validator";
import { NgEzEqualsValidator } from "./equals.validator";
import { NgEzFileTypeValidator } from "./file-type.validator";
import { NgEzMaxSizeValidator } from "./max-size.validator";
import { NgEzTotalSizeValidator } from "./total-size.validator";

const COMMON_EXPORTS = [
    NgEzUrlValidator,
    NgEzEqualsValidator,
    NgEzFileTypeValidator,
    NgEzMaxSizeValidator,
    NgEzTotalSizeValidator
];

@NgModule({
    declarations: COMMON_EXPORTS,
    exports: COMMON_EXPORTS
})
export class NgEzFormsModule{}