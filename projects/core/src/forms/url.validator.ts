import { Directive, forwardRef } from "@angular/core";
import { Validator, AbstractControl, NG_VALIDATORS, ValidationErrors } from "@angular/forms";
import { NgEzValidators } from "./validators";

@Directive({
    selector: '[ngezUrl][formControlName],[ngezUrl][formControl],[ngezUrl][ngModel]',
    providers:  [{
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => NgEzUrlValidator),
        multi: true
    }]
})
export class NgEzUrlValidator implements Validator{

    validate(control: AbstractControl): ValidationErrors{
        return NgEzValidators.url(control);
    }
}