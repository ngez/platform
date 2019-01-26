import { Directive, forwardRef, Input, SimpleChanges, OnInit, OnChanges } from "@angular/core";
import { NG_VALIDATORS, Validator, AbstractControl, ValidatorFn, ValidationErrors } from "@angular/forms";
import { NgEzValidators } from "./validators";

@Directive({
    selector: '[ngezFileType][formControlName],[ngezFileType][formControl],[ngezFileType][ngModel]',
    providers:  [{
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => NgEzFileTypeValidator),
        multi: true
    }]
})
export class NgEzFileTypeValidator implements Validator, OnInit, OnChanges{

    @Input() accept: string;

    private validator: ValidatorFn;

    private onChange: Function;

    ngOnChanges(changes: SimpleChanges){
        this.createValidator();
        if(this.onChange)
            this.onChange();
    }

    ngOnInit() {
        if(!this.validator)
            this.createValidator();
    }

    validate(control: AbstractControl): ValidationErrors{
        return this.validator ? this.validator(control) : null;
    }

    registerOnValidatorChange(fn){
        this.onChange = fn;
    }

    private createValidator(){
        this.validator = NgEzValidators.fileType(this.accept);
    }
}