import { Component, ElementRef } from "@angular/core";

@Component({
    selector: 'ngez-lazy-load',
    templateUrl: './lazy-load.component.html',
    styleUrls: ['./lazy-load.component.scss']
})
export class NgEzLazyLoadComponent{
    shouldRender = true;
}