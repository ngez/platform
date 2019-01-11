import { Directive, forwardRef, Input, SimpleChanges, OnInit, OnChanges } from "@angular/core";
import { NG_VALIDATORS, Validator, AbstractControl, ValidatorFn } from "@angular/forms";
import { NgEzValidators } from "./validators";

@Directive({
    selector: '[ngezTotalSize][formControlName],[ngezTotalSize][formControl],[ngezTotalSize][ngModel]',
    providers:  [{
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => NgEzTotalSizeValidator),
        multi: true
    }]
})
export class NgEzTotalSizeValidator implements Validator, OnInit, OnChanges{

    @Input('ngezTotalSize') totalSize: number;

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

    validate(control: AbstractControl){
        return this.validator ? this.validator(control) : null;
    }

    registerOnValidatorChange(fn){
        this.onChange = fn;
    }

    private createValidator(){
        this.validator = NgEzValidators.totalSize(+this.totalSize);
    }
}