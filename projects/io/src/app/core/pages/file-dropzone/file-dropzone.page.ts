import { Component } from "@angular/core";
import { NgEzCodePrettifyConfig } from "@ngez/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
    selector: 'file-dropzone',
    templateUrl: './file-dropzone.page.html',
    styleUrls: ['./file-dropzone.page.scss']
})
export class FileDropzonePage{

    form: FormGroup;

    code1: NgEzCodePrettifyConfig = {
        language: 'html',
        path: 'assets/code-snippets/core/file-dropzone/app.component.html',
        theme: 'dark',
        canCopy: true,
        header: 'app.component.html'
    };

    code2: NgEzCodePrettifyConfig = {
        language: 'typescript',
        path: 'assets/code-snippets/core/file-dropzone/app.component.scss',
        theme: 'dark',
        canCopy: true,
        header: 'app.component.scss'
    };

    code3: NgEzCodePrettifyConfig = {
        language: 'typescript',
        path: 'assets/code-snippets/core/file-dropzone/app.component.ts',
        theme: 'dark',
        canCopy: true,
        header: 'app.component.ts'
    };

    constructor(fb: FormBuilder){
        this.form = fb.group({
            files: []
        });
    }

    onRemove(file: File){
        const control = this.form.get('files');
        control.setValue((control.value as File[]).filter(f => file != f))
    }
}