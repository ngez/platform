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
            password: '',
            confirmPassword: '',
            url: ['', NgEzValidators.url],
            file: [null, [
                //The accept attribute on a file input is useful to narrow down results for the user
                //but it's still quite easy to select files with a different extension, so add this client-side validation
                //This only checks the mime type and extension. Anyone could simply change the file extension and then pick that file.
                //Do not rely solely on this, you should still implement server-side validation.
                NgEzValidators.fileType('.jpg, .txt, audio/mp3, video/*'),
                //Checks that none of the files exceed the limit
                //Expects the amount in bytes, but you can use our NgEzByteUtils class to quickly make the conversion for you
                NgEzValidators.maxSize(NgEzByteUtils.convert(1, 'megabyte')),
                //Checks that the sum of all file sizes does not exceed the limit
                NgEzValidators.totalSize(NgEzByteUtils.convert(10, 'megabyte'))
            ]]
        }, {validators: NgEzValidators.equals('password', 'confirmPassword')});
    }

}