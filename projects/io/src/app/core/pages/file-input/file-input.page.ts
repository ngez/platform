import { Component } from "@angular/core";
import { NgEzCodePrettifyConfig } from "@ngez/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgEzFileInputConfig } from "../../../../../../core/src/file-input/models";
import { NgEzValidators } from "../../../../../../core/src/validators";

@Component({
    selector: 'file-input',
    templateUrl: './file-input.page.html'
})
export class FileInputPage{

    form: FormGroup;

    config: NgEzFileInputConfig = {
        multiple: true,
    }

    code1: NgEzCodePrettifyConfig = {
        language: 'html',
        path: 'assets/code-snippets/core/in-viewport/app.component.html',
        theme: 'dark',
        canCopy: true,
        header: 'app.component.html'
    };

    code2: NgEzCodePrettifyConfig = {
        language: 'typescript',
        path: 'assets/code-snippets/core/in-viewport/app.component.ts',
        theme: 'dark',
        canCopy: true,
        header: 'app.component.ts'
    };

    constructor(fb: FormBuilder){
        this.form = fb.group({
            c1: [null, [NgEzValidators.fileType('.jpg, .jpeg, image/*, application/msword,video/*,application/vnd.openxmlformats-officedocument.wordprocessingml.document'), NgEzValidators.fileSize(1, 'megabyte')]]
        });
    }

}