import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { NgEzCodePrettifyOptions } from "@ngez/core";

@Component({
    selector: 'core-overview',
    templateUrl: './core-overview.page.html'
})
export class CoreOverviewPage {

    isLoading = false;
    hasError = false;

    options: NgEzCodePrettifyOptions = {
        language: 'sh',
        path: 'assets/code-snippets/core/overview/installation.sh',
        theme: 'dark'
    };

    options2: NgEzCodePrettifyOptions = {
        language: 'sh',
        path: 'assets/code-snippets/core/overview/angular-cdk-installation.sh',
        theme: 'dark'
    };
    
}