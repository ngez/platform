import { Component } from "@angular/core";
import { NgEzInViewportConfig } from "../../../../../../core/src/in-viewport";

@Component({
    selector: 'lazy-image',
    templateUrl: './lazy-image.page.html'
})
export class LazyImagePage{

    config: NgEzInViewportConfig = {
        querySelector: '#test',
        offset: {
            top: 30,
            bottom: 50
        }
    }
}