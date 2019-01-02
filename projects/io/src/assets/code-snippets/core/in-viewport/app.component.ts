import { Component, ViewChild } from "@angular/core";
import { NgEzInViewportEvent, NgEzInViewportDirective } from "@ngez/core";

@Component({
    selector: 'app',
    templateUrl: './app.component.html'
})
export class AppComponent{

    @ViewChild(NgEzInViewportDirective) inViewport: NgEzInViewportDirective;

    onChange(event: NgEzInViewportEvent){
        console.log(event)
    }

    someMethod(){
        //NgEzInViewportDirective will check if the element is in the viewport during scroll, window resize and on init.
        //You can always get reference to the directive and check manually.
        this.inViewport.check(); 
    }
}