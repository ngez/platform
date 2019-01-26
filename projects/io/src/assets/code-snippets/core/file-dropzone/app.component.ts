import { Component } from "@angular/core";
import { NgEzByteUtils, NgEzValidators } from "@ngez/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
    selector: 'app',
    templateUrl: './app.component.html'
})
export class AppComponent {

    form: FormGroup;

    constructor(fb: FormBuilder){
        this.form = fb.group({
            files: [[]]
        });
    }

    onRemove(file: File){
        const control = this.form.get('files');
        control.setValue((control.value as File[]).filter(f => file != f))
    }

}