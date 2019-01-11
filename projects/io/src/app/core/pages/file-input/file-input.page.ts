import { Component } from "@angular/core";
import { NgEzCodePrettifyConfig, NgEzByteUtils } from "@ngez/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgEzValidators } from "../../../../../../core/src/forms";

@Component({
    selector: 'file-input',
    templateUrl: './file-input.page.html'
})
export class FileInputPage{

    form: FormGroup;

    f1;

    f2;

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
            url: ['', NgEzValidators.url],
            password: [''],
            confirmPassword: [''],
            c1: [null, [NgEzValidators.fileType('.jpg, .jpeg, image/*, application/msword,video/*,application/vnd.openxmlformats-officedocument.wordprocessingml.document'), NgEzValidators.maxSize(NgEzByteUtils.convert(1, 'megabyte'))]]
        }, {validators: NgEzValidators.equals('password', 'confirmPassword')});

        this.form.valueChanges.subscribe(value =>console.log(value))
    }

}