import { Component, ViewChild } from "@angular/core";
import * as faker from 'faker';
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgEzAutocompleteConfig, NgEzCodePrettifyOptions, NgEzAutocompleteDirective } from "@ngez/core";

@Component({
    selector: 'autocomplete',
    templateUrl: './autocomplete.page.html'
})
export class AutocompletePage {

    @ViewChild(NgEzAutocompleteDirective) autocomplete: NgEzAutocompleteDirective;

    form: FormGroup;

    config: NgEzAutocompleteConfig = {
        labelExtractor: option => option.username
    }

    options1;

    code1: NgEzCodePrettifyOptions = {
        language: 'scss',
        path: 'assets/code-snippets/core/autocomplete/styles.scss',
        theme: 'dark',
        canCopy: true,
        header: 'styles.scss'
    };

    code2: NgEzCodePrettifyOptions = {
        language: 'html',
        path: 'assets/code-snippets/core/autocomplete/app.component.html',
        theme: 'dark',
        canCopy: true,
        header: 'app.component.html'
    };

    code3: NgEzCodePrettifyOptions = {
        language: 'typescript',
        path: 'assets/code-snippets/core/autocomplete/app.component.ts',
        theme: 'dark',
        canCopy: true,
        header: 'app.component.ts'
    };

    code4: NgEzCodePrettifyOptions = {
        language: 'css',
        path: 'assets/code-snippets/core/autocomplete/custom.scss',
        theme: 'dark',
        canCopy: true,
        header: 'styles.scss'
    };

    constructor(formBuilder: FormBuilder){
        this.form = formBuilder.group({
            c1: null
        });
    }

    ngOnInit(){
        this.options1 = this.setOptions();
        
    }

    setOptions() {
        const options = [];
        for (let i = 0; i < 100; i++) {
            const user = {
                id: faker.random.uuid(),
                username: faker.internet.userName(),
                avatar: faker.internet.avatar()
            }
            options.push(user)
        }

        return options;
    }
}