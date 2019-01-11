import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgEzFileTypeValidator } from "./file-type.validator";
import { FormControl } from "@angular/forms";

describe('FileTypeValidator', () => {

    let directive: NgEzFileTypeValidator;

    beforeEach(() => {
        directive = new NgEzFileTypeValidator();
    });

    it('should return null if the "accept" input is undefined', () => {

        const file = new File(["blob"], "song.mp3", { type: 'audio/mp3' });

        expect(directive.validate(new FormControl(file))).toBeNull();
    });

    it('should return null if the file type is valid', () => {
        const f1 = new File(["blob"], "song.mp3", { type: 'audio/mp3' });
        const f2 = new File(["blob"], "99872_n.jpg", { type: 'image/jpeg' });
        const f3 = new File(["blob"], "asdf.txt", { type: 'text/plain' });

        directive.accept = 'audio/mp3, .txt, image/*';

        directive.ngOnChanges(null);

        expect(directive.validate(new FormControl(f1))).toBeNull();
        expect(directive.validate(new FormControl(f2))).toBeNull();
        expect(directive.validate(new FormControl(f3))).toBeNull();
    });

    it('should return an error object if any of the file types are invalid', () => {
        const f1 = new File(["blob"], "song.mp3", { type: 'audio/mp3' });
        const f2 = new File(["blob"], "99872_n.jpg", { type: 'image/jpeg' });
        const f3 = new File(["blob"], "asdf.txt", { type: 'text/plain' });

        directive.accept = 'audio/mp3, image/*';

        directive.ngOnChanges(null);

        expect(directive.validate(new FormControl(f3))).toBeTruthy();
        expect(directive.validate(new FormControl([f2, f3]))).toBeTruthy();
        expect(directive.validate(new FormControl([f1, f3]))).toBeTruthy();
    });
});