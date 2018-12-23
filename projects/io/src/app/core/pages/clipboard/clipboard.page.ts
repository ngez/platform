import { Component } from "@angular/core";
import { NgEzCodePrettifyConfig, NgEzClipboardService } from "@ngez/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'clipboard',
    templateUrl: './clipboard.page.html'
})
export class ClipboardPage {

    config1: NgEzCodePrettifyConfig = {
        language: 'html',
        path: 'assets/code-snippets/core/clipboard/app.component.html',
        theme: 'dark',
        canCopy: true,
        header: 'app.component.html'
    };

    config2: NgEzCodePrettifyConfig = {
        language: 'typescript',
        path: 'assets/code-snippets/core/clipboard/app.component.ts',
        theme: 'dark',
        canCopy: true,
        header: 'app.component.ts'
    };

    form: FormGroup;

    constructor(private clipboard: NgEzClipboardService, private snackbar: MatSnackBar, formBuilder: FormBuilder) {
        this.form = formBuilder.group({
            text: ''
        });
    }

    onCopy() {
        const text = this.form.value.text;
        if (this.clipboard.copy(text))
            this.snackbar.open(`Copied: ${text}`, null, { duration: 2000 });
        else
            this.snackbar.open('Something went wrong while copying', null, { duration: 2000 });
    }
}