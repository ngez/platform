import { Component } from "@angular/core";
import { NgEzCodePrettifyConfig } from "@ngez/core";

@Component({
    selector: 'code-prettify',
    templateUrl: './code-prettify.page.html'
})
export class CodePrettifyPage {

    code1: NgEzCodePrettifyConfig = {
        language: 'javascript',
        path: 'assets/code-snippets/core/code-prettify/app.js',
        theme: 'dark',
        canCopy: true,
        header: 'app.js'
    };

    code2: NgEzCodePrettifyConfig = {
        language: 'html',
        path: 'assets/code-snippets/core/code-prettify/app.component.html',
        theme: 'dark',
        canCopy: true,
        header: 'app.component.html'
    };

    code3: NgEzCodePrettifyConfig = {
        language: 'typescript',
        path: 'assets/code-snippets/core/code-prettify/app.component.ts',
        theme: 'dark',
        canCopy: true,
        header: 'app.component.ts'
    };

    code4: NgEzCodePrettifyConfig = {
        language: 'css',
        path: 'assets/code-snippets/core/code-prettify/custom.scss',
        theme: 'dark',
        canCopy: true,
        header: 'styles.scss'
    };
}