import { Directive, forwardRef, Input, OnChanges, SimpleChanges, OnInit } from "@angular/core";
import { Validator, AbstractControl, NG_VALIDATORS, ValidatorFn, Validators, ValidationErrors } from "@angular/forms";
import { NgEzValidators } from "./validators";

@Directive({
    selector: '[ngezEquals][formGroupName], [ngezEquals][formGroup], form[ngezEquals], [ngezEquals][ngModelGroup]',
    providers:  [{
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => NgEzEqualsValidator),
        multi: true
    }],
    host: {
        '[attr.c1]': 'c1 ? c1 : null',
        '[attr.c2]': 'c2 ? c2 : null'
    }
})
export class NgEzEqualsValidator implements Validator, OnChanges, OnInit{

    @Input() c1: string;

    @Input() c2: string;

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
        this.validator = NgEzValidators.equals(this.c1, this.c2);
    }
}