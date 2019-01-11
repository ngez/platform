import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl } from "@angular/forms";
import { NgEzTotalSizeValidator } from "./total-size.validator";

describe('TotalSizeValidator', () => {

    let directive: NgEzTotalSizeValidator;

    beforeEach(() => {
        directive = new NgEzTotalSizeValidator();
    });

    it('should return null if the "totalSize" input is undefined', () => {

        const file = new File(["blob"], "song.mp3", { type: 'audio/mp3' });

        expect(directive.validate(new FormControl(file))).toBeNull();
    });

    it('should return null if the sum of all file sizes is valid.', () => {
        const f1 = new File([getRandomText(1)], "file1.txt", { type: 'text/plain' });
        const f2 = new File([getRandomText(999997)], "file2.txt", { type: 'text/plain' });
        const f3 = new File([getRandomText(2)], "file3.txt", { type: 'text/plain' });

        directive.totalSize = 1000000;

        directive.ngOnChanges(null);

        expect(directive.validate(new FormControl(f1))).toBeNull();
        expect(directive.validate(new FormControl(f2))).toBeNull();
        expect(directive.validate(new FormControl(f3))).toBeNull();
        expect(directive.validate(new FormControl([f1, f3]))).toBeNull();
        expect(directive.validate(new FormControl([f1, f2]))).toBeNull();
        expect(directive.validate(new FormControl([f1, f2, f3]))).toBeNull();
    });

    it('should return an error object if the sum of all file sizes exceeds the limit.', () => {
        const f1 = new File([getRandomText(1)], "file1.txt", { type: 'text/plain' });
        const f2 = new File([getRandomText(1000001)], "file2.txt", { type: 'text/plain' });
        const f3 = new File([getRandomText(1000000)], "file3.txt", { type: 'text/plain' });

        directive.totalSize = 1000000;

        directive.ngOnChanges(null);

        expect(directive.validate(new FormControl(f2))).toBeTruthy();
        expect(directive.validate(new FormControl([f1, f3]))).toBeTruthy();
    });
});

function getRandomText(length: number) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}