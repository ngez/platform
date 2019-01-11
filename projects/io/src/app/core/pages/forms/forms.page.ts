import { Component } from "@angular/core";
import { NgEzCodePrettifyConfig, NgEzByteUtils } from "@ngez/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
    selector: 'forms',
    templateUrl: './forms.page.html'
})
export class FormsPage{

    form: FormGroup;

    code1: NgEzCodePrettifyConfig = {
        language: 'html',
        path: 'assets/code-snippets/core/forms/app.component.html',
        theme: 'dark',
        canCopy: true,
        header: 'Template-driven forms (FormsModule)'
    };

    code2: NgEzCodePrettifyConfig = {
        language: 'typescript',
        path: 'assets/code-snippets/core/forms/app.component.ts',
        theme: 'dark',
        canCopy: true,
        header: 'Model-driven forms (ReactiveFormsModule)'
    };

}