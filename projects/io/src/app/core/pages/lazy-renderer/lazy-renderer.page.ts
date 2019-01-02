import { Component } from "@angular/core";
import * as faker from 'faker';
import { NgEzCodePrettifyConfig } from "@ngez/core";

@Component({
    selector: 'lazy-renderer',
    templateUrl: './lazy-renderer.page.html'
})
export class LazyRendererPage{

    image = faker.image.people();

    code1: NgEzCodePrettifyConfig = {
        language: 'html',
        path: 'assets/code-snippets/core/lazy-renderer/app.component.html',
        theme: 'dark',
        canCopy: true,
        header: 'app.component.html'
    };

    code2: NgEzCodePrettifyConfig = {
        language: 'typescript',
        path: 'assets/code-snippets/core/lazy-renderer/app.component.ts',
        theme: 'dark',
        canCopy: true,
        header: 'app.component.ts'
    };
}