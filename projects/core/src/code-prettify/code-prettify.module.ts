import { NgModule } from "@angular/core";
import { NgEzCodePrettifyComponent } from "./code-prettify.component";
import { CodeService } from "./code.service";
import { PrettifyService } from "./prettify.service";
import { NgEzCodeLoadingComponent } from "./code-loading.component";
import { NgEzCodeLoadingErrorComponent } from "./code-loading-error.component";
import { CommonModule } from "@angular/common";
import { NgEzReloadDirective } from "./reload.directive";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgEzClipboardModule } from "../clipboard";

const COMMON_DECLARATIONS = [
    NgEzCodePrettifyComponent, 
    NgEzCodeLoadingComponent, 
    NgEzCodeLoadingErrorComponent,
    NgEzReloadDirective
];

@NgModule({
    imports: [CommonModule, FontAwesomeModule, NgEzClipboardModule],
    declarations: COMMON_DECLARATIONS,
    exports: COMMON_DECLARATIONS,
    providers: [CodeService, PrettifyService]
})
export class NgEzCodePrettifyModule{}