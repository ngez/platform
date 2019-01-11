import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl } from "@angular/forms";
import { NgEzUrlValidator } from "./url.validator";

describe('UrlValidator', () => {

    let directive: NgEzUrlValidator;

    beforeEach(() => {
        directive = new NgEzUrlValidator();
    });

    it('should return null if the url is valid', () => {
        expect(directive.validate(new FormControl('ftp://www.google.com'))).toBeNull();
        expect(directive.validate(new FormControl('http://www.google.com'))).toBeNull();
        expect(directive.validate(new FormControl('https://www.google.com'))).toBeNull();
        expect(directive.validate(new FormControl('https://www.google.com/search?q=angular'))).toBeNull();
    });

    it('should return an error object if the url is invalid.', () => {
        expect(directive.validate(new FormControl('invalid-url'))).toBeTruthy();
        expect(directive.validate(new FormControl('www.google.com'))).toBeTruthy();
        expect(directive.validate(new FormControl('http//www.google.com'))).toBeTruthy();
        expect(directive.validate(new FormControl('http:/www.google.com'))).toBeTruthy();
        expect(directive.validate(new FormControl('http:///www.google.com'))).toBeTruthy();
        expect(directive.validate(new FormControl('htt://www.google.com'))).toBeTruthy();
        expect(directive.validate(new FormControl('http:///www.google'))).toBeTruthy();
    });
});