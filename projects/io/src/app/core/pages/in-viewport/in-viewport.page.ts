import { Component } from "@angular/core";
import { NgEzCodePrettifyConfig, NgEzInViewportEvent } from "@ngez/core";

@Component({
    selector: 'in-viewport',
    templateUrl: './in-viewport.page.html'
})
export class InViewportPage{

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

    onChange(e: NgEzInViewportEvent){
        console.log(e)
    }
}