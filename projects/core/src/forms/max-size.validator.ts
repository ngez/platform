import { Directive, forwardRef, Input, SimpleChanges, OnInit, OnChanges } from "@angular/core";
import { NG_VALIDATORS, Validator, AbstractControl, ValidatorFn, ValidationErrors } from "@angular/forms";
import { NgEzValidators } from "./validators";

@Directive({
    selector: '[ngezMaxSize][formControlName],[ngezMaxSize][formControl],[ngezMaxSize][ngModel]',
    providers:  [{
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => NgEzMaxSizeValidator),
        multi: true
    }]
})
export class NgEzMaxSizeValidator implements Validator, OnInit, OnChanges{

    @Input('ngezMaxSize') maxSize: number;

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
        this.validator = NgEzValidators.maxSize(+this.maxSize);
    }
}