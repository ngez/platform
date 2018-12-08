import { Component, ViewChild, TemplateRef } from "@angular/core";

@Component({
    selector: 'ngez-code-loading',
    templateUrl: './code-loading.component.html'
})
export class NgEzCodeLoadingComponent{

    @ViewChild('template') template: TemplateRef<any>;
}