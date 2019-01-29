import { Component, ViewChild } from "@angular/core";
import { NgEzByteUtils, NgEzValidators, NgEzFileDropzoneDirective } from "@ngez/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
    selector: 'app',
    templateUrl: './app.component.html'
})
export class AppComponent {

    @ViewChild(NgEzFileDropzoneDirective) dropzone: NgEzFileDropzoneDirective;

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

    //Programtically open file browser
    onBrowse(){
        this.dropzone.browse();
    }

}