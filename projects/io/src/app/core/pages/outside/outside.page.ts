import { Component } from "@angular/core";
import { NgEzCodePrettifyConfig } from "@ngez/core";

@Component({
    selector: 'outside',
    templateUrl: './outside.page.html'
})
export class OutsidePage {

    config1: NgEzCodePrettifyConfig = {
        language: 'html',
        path: 'assets/code-snippets/core/outside/app.component.html',
        theme: 'dark',
        canCopy: true,
        header: 'app.component.html'
    };

    config2: NgEzCodePrettifyConfig = {
        language: 'typescript',
        path: 'assets/code-snippets/core/outside/app.component.ts',
        theme: 'dark',
        canCopy: true,
        header: 'app.component.ts'
    };

    clicks = 0;

    onOutsideClick(){
        this.clicks++;
    }
}