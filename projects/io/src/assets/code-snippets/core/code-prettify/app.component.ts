import { Component } from "@angular/core";
import { NgEzCodePrettifyConfig } from "@ngez/core";

@Component({
    selector: 'app',
    templateUrl: './app.component.html'
})
export class AppComponent {

    config: NgEzCodePrettifyConfig = {
        language: 'typescript',
        //If you already have the code, ignore this and pass it in the "code" property.
        //Assuming you have a file in this path
        path: 'assets/code-snippets/app.js',
        //By default the component supports light and dark themes, but you can implement your own
        theme: 'dark',
        //Whether it should show the copy to clipboard button.
        canCopy: true,
        //File name or any text you want in the header.
        header: 'app.js',
        //Enable line numbers. It can also be a number if you'd like to start at a different number.
        linenums: true
    };
}