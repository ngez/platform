import { Component } from "@angular/core";
import { NgEzCodePrettifyConfig } from "@ngez/core";

@Component({
    selector: 'nested-nav',
    templateUrl: './nested-nav.page.html'
})
export class NestedNavPage {

    routerLinkOptions = {
        exact: true
    };

    code1: NgEzCodePrettifyConfig = {
        language: 'html',
        path: 'assets/code-snippets/core/nested-nav/app.component.html',
        theme: 'dark',
        canCopy: true,
        header: 'app.component.html'
    };

    code2: NgEzCodePrettifyConfig = {
        language: 'typescript',
        path: 'assets/code-snippets/core/nested-nav/app.component.ts',
        theme: 'dark',
        canCopy: true,
        header: 'app.component.ts'
    };

    code3: NgEzCodePrettifyConfig = {
        language: 'css',
        path: 'assets/code-snippets/core/nested-nav/custom.scss',
        theme: 'dark',
        canCopy: true,
        header: 'styles.scss'
    };
}