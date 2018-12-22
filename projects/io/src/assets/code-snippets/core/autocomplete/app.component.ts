import { Component, AfterViewInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { NgEzAutocompleteDirective, NgEzAutocompleteConfig } from "@ngez/core";

@Component({
    selector: 'app',
    templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit{

    form: FormGroup;

    config: NgEzAutocompleteConfig = {
        //The user is an object, so we can provide a function to display the selected option in the input.
        labelExtractor: option => option.username
    }

    @ViewChild(NgEzAutocompleteDirective) autocomplete: NgEzAutocompleteDirective;

    users = [];

    constructor(formBuilder: FormBuilder){
        this.form = formBuilder.group({
            user: null
        });

        for(let i = 0; i < 10; i++){
            const user = {
                id: i,
                username: `user${i}`
            }
            this.users.push(user);
        }
    }

    ngAfterViewInit() {
        //Assuming you need the actual input text
        this.autocomplete.text$.subscribe(text => {
            //Perform custom filtering or http call.
            console.log(text)
        })
    }

    //In case you need to programmatically open or close the panel.

    onOpen() {
        this.autocomplete.open();
    }

    onClose() {
        this.autocomplete.close();
    }

    onToggle() {
        this.autocomplete.toggle();
    }
}