import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl } from "@angular/forms";
import { NgEzMaxSizeValidator } from "./max-size.validator";

describe('MaxSizeValidator', () => {

    let directive: NgEzMaxSizeValidator;

    beforeEach(() => {
        directive = new NgEzMaxSizeValidator();
    });

    it('should return null if the "maxSize" input is undefined', () => {

        const file = new File(["blob"], "song.mp3", { type: 'audio/mp3' });

        expect(directive.validate(new FormControl(file))).toBeNull();
    });

    it('should return null if all the file sizes are valid.', () => {
        const f1 = new File([getRandomText(1)], "file1.txt", { type: 'text/plain' });
        const f2 = new File([getRandomText(999999)], "file2.txt", { type: 'text/plain' });
        const f3 = new File([getRandomText(500)], "file3.txt", { type: 'text/plain' });

        directive.maxSize = 1000000;

        directive.ngOnChanges(null);

        expect(directive.validate(new FormControl(f1))).toBeNull();
        expect(directive.validate(new FormControl(f2))).toBeNull();
        expect(directive.validate(new FormControl(f3))).toBeNull();
        expect(directive.validate(new FormControl([f1, f3]))).toBeNull();
        expect(directive.validate(new FormControl([f1, f2]))).toBeNull();
    });

    it('should return an error object if any of the file sizes are invalid', () => {
        const f1 = new File([getRandomText(1)], "file1.txt", { type: 'text/plain' });
        const f2 = new File([getRandomText(1000001)], "file2.txt", { type: 'text/plain' });
        const f3 = new File([getRandomText(5000000)], "file3.txt", { type: 'text/plain' });

        directive.maxSize = 1000000;

        directive.ngOnChanges(null);

        expect(directive.validate(new FormControl(f3))).toBeTruthy();
        expect(directive.validate(new FormControl([f1, f2]))).toBeTruthy();
    });
});

function getRandomText(length: number) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}