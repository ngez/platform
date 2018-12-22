import { Component } from "@angular/core";

@Component({
    selector: 'app',
    templateUrl: './app.component.html'
})
export class AppComponent {

    clicks = 0;

    onOutsideClick(){
        this.clicks++;
    }
}