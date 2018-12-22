import { Component } from "@angular/core";
import { NgEzCodePrettifyOptions } from "@ngez/core";

@Component({
    selector: 'nested-nav',
    templateUrl: './nested-nav.page.html'
})
export class NestedNavPage {

    routerLinkOptions = {
        exact: true
    };

    code1: NgEzCodePrettifyOptions = {
        language: 'html',
        path: 'assets/code-snippets/core/nested-nav/app.component.html',
        theme: 'dark',
        canCopy: true,
        header: 'app.component.html'
    };

    code2: NgEzCodePrettifyOptions = {
        language: 'typescript',
        path: 'assets/code-snippets/core/nested-nav/app.component.ts',
        theme: 'dark',
        canCopy: true,
        header: 'app.component.ts'
    };

    code3: NgEzCodePrettifyOptions = {
        language: 'css',
        path: 'assets/code-snippets/core/nested-nav/custom.scss',
        theme: 'dark',
        canCopy: true,
        header: 'styles.scss'
    };
}