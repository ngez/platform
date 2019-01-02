import { Component, ViewChild } from "@angular/core";
import { NgEzLazyRendererConfig, NgEzLazyRendererComponent } from "@ngez/core";

@Component({
    selector: 'app',
    templateUrl: './app.component.html'
})
export class AppComponent {

    //By default the content will be rendered exactly when entering the viewport.
    //You can add an offset so that it's rendered for example 100px before actually visible.
    config: NgEzLazyRendererConfig = {
        offset: {
            top: 100
        }
    }
    
    @ViewChild(NgEzLazyRendererComponent) lazyRenderer: NgEzLazyRendererComponent;

    someMethod() {
        //You can always get a reference to the NgEzLazyRendererComponent and manually render the content.
        this.lazyRenderer.render();
    }
}