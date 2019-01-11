import { Component } from "@angular/core";
import { NgEzCodePrettifyConfig } from "@ngez/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
    selector: 'file-input',
    templateUrl: './file-input.page.html'
})
export class FileInputPage{

    form: FormGroup;

    code1: NgEzCodePrettifyConfig = {
        language: 'html',
        path: 'assets/code-snippets/core/file-input/app.component.html',
        theme: 'dark',
        canCopy: true,
        header: 'app.component.html'
    };

    code2: NgEzCodePrettifyConfig = {
        language: 'typescript',
        path: 'assets/code-snippets/core/file-input/app.component.ts',
        theme: 'dark',
        canCopy: true,
        header: 'app.component.ts'
    };

    constructor(fb: FormBuilder){
        this.form = fb.group({
            file: null
        });
    }

}