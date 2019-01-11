import { NgEzEqualsValidator } from "./equals.validator";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormGroup, FormBuilder } from "@angular/forms";

describe('EqualsValidator', () => {

    const formBuilder = new FormBuilder();
    let directive: NgEzEqualsValidator;

    beforeEach(() => {
        directive = new NgEzEqualsValidator();
    });

    it('should return null if not passed the controls or if both controls are equal', () => {
        const form = formBuilder.group({
            password: 'passw0rd',
            confirmPassword: 'passw0rd'
        });

        expect(directive.validate(form)).toBeNull();

        directive.c1 = 'password';

        directive.ngOnChanges(null);

        expect(directive.validate(form)).toBeNull();

        directive.c2 = 'confirmPassword';

        directive.ngOnChanges(null);

        expect(directive.validate(form)).toBeNull();
    });

    it('should return an error object if the controls are not equal', () => {
        const form = formBuilder.group({
            password: 'passw0rd',
            confirmPassword: 'password'
        });

        directive.c1 = 'password';

        directive.c2 = 'confirmPassword';

        directive.ngOnChanges(null);

        expect(directive.validate(form)).toBeTruthy();
    });
});