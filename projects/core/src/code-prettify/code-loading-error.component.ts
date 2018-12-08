import { Component, TemplateRef, ViewChild, ContentChild } from "@angular/core";
import { NgEzReloadDirective } from "./reload.directive";

@Component({
    selector: 'ngez-code-loading-error',
    templateUrl: './code-loading-error.component.html'
})
export class NgEzCodeLoadingErrorComponent{

    @ViewChild('template') template: TemplateRef<any>;

    @ContentChild(NgEzReloadDirective) reloadDirective: NgEzReloadDirective;

}