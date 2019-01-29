import { NgEzValidators } from "./validators";
import { FormControl, FormBuilder, FormGroup } from "@angular/forms";
import { NgEzByteUtils } from "../utils";

describe('Validators', () => {

    describe('equals()', () => {
        let formGroup: FormGroup;

        beforeEach(() => {
            formGroup = new FormBuilder().group({
                password: '',
                confirmPassword: ''
            }, {validators: NgEzValidators.equals('password', 'confirmPassword')});
        });

        it("shouldn't have any errors when both controls are empty", () => {
            expect(formGroup.hasError('equals')).toBe(false);
        });

        it("should have an error if both controls aren't equal", () => {
            formGroup.patchValue({password: 'p4ssword'});
            formGroup.patchValue({confirmPassword: 'p4ssw0rd'});
            expect(formGroup.hasError('equals')).toBe(true);
        });

        it("shouldn't have an error if both controls are equal", () => {
            formGroup.patchValue({password: 'p4ssw0rd'});
            expect(formGroup.hasError('equals')).toBe(true);
            formGroup.patchValue({confirmPassword: 'p4ssw0rd'});
            expect(formGroup.hasError('equals')).toBe(false);
            
        });
    });

    describe('url()', () => {
        it("should return an error object when invalid", () => {
            expect(NgEzValidators.url(new FormControl('invalid-url'))).toBeTruthy();
            expect(NgEzValidators.url(new FormControl('www.google.com'))).toBeTruthy();
            expect(NgEzValidators.url(new FormControl('http//www.google.com'))).toBeTruthy();
            expect(NgEzValidators.url(new FormControl('http:/www.google.com'))).toBeTruthy();
            expect(NgEzValidators.url(new FormControl('http:///www.google.com'))).toBeTruthy();
            expect(NgEzValidators.url(new FormControl('htt://www.google.com'))).toBeTruthy();
            expect(NgEzValidators.url(new FormControl('http:///www.google'))).toBeTruthy();
        });

        it("should return null when valid", () => {
            expect(NgEzValidators.url(new FormControl('ftp://www.google.com'))).toBeNull();
            expect(NgEzValidators.url(new FormControl('http://www.google.com'))).toBeNull();
            expect(NgEzValidators.url(new FormControl('https://www.google.com'))).toBeNull();
            expect(NgEzValidators.url(new FormControl('https://www.google.com/search?q=angular'))).toBeNull();
        });
    });

    describe('fileType()', () => {

        it('should return null if not passed the "accept" param', () => {
            const validator = NgEzValidators.fileType(null);
            const file = new File(["blob"], "song.mp3", { type: 'audio/mp3' });
            expect(validator(new FormControl(file))).toBeNull();
        });

        it('should return null if passed an empty string', () => {
            const validator = NgEzValidators.fileType('');
            const file = new File(["blob"], "song.mp3", { type: 'audio/mp3' });
            expect(validator(new FormControl(file))).toBeNull();
        });

        it('should return null if not passed a File, FileList or File[]', () => {
            const validator = NgEzValidators.fileType('.jpg');
            expect(validator(new FormControl(null))).toBeNull();
            expect(validator(new FormControl(100))).toBeNull();
            expect(validator(new FormControl('some string'))).toBeNull();
            expect(validator(new FormControl({ name: 'filename' }))).toBeNull();
            expect(validator(new FormControl([]))).toBeNull();
            expect(validator(new FormControl([1]))).toBeNull();
            const file = new File(["blob"], "song.mp3", { type: 'audio/mp3' });
            expect(validator(new FormControl([1, file]))).toBeNull();
        });

        it('should return an error object if any of the file types are invalid', () => {
            const f1 = new File(["blob"], "song.mp3", { type: 'audio/mp3' });
            const f2 = new File(["blob"], "99872_n.jpg", { type: 'image/jpeg' });
            const f3 = new File(["blob"], "asdf.txt", { type: 'text/plain' });
            const validator = NgEzValidators.fileType('.jpg, audio/*');

            expect(validator(new FormControl(f3))).toBeTruthy();
            expect(validator(new FormControl([f3]))).toBeTruthy();
            expect(validator(new FormControl([f3, f3]))).toBeTruthy();
            expect(validator(new FormControl([f1, f3]))).toBeTruthy();
            expect(validator(new FormControl([f1, f2, f3]))).toBeTruthy();
        });

        it('should return an error object if provided a File and an array of errors if provided a FileList or File[]', () => {
            const f1 = new File(["blob"], "song.mp3", { type: 'audio/mp3' });
            const f2 = new File(["blob"], "99872_n.jpg", { type: 'image/jpeg' });
            const f3 = new File(["blob"], "asdf.txt", { type: 'text/plain' });
            const accept = '.jpg, audio/*';
            const validator = NgEzValidators.fileType(accept);

            expect(validator(new FormControl(f3))).toEqual({ accept, actualFile: f3 });
            expect(validator(new FormControl([f3]))).toEqual([{ accept, actualFile: f3 }]);
            expect(validator(new FormControl([f3, f3]))).toEqual([{ accept, actualFile: f3 }, { accept, actualFile: f3 }]);
            expect(validator(new FormControl([f1, f3]))).toEqual([{ accept, actualFile: f3 }]);
            expect(validator(new FormControl([f1, f2, f3]))).toEqual([{ accept, actualFile: f3 }]);
        });

        it('should return null if all the file types are valid.', () => {
            const f1 = new File(["blob"], "song.mp3", { type: 'audio/mp3' });
            const f2 = new File(["blob"], "99872_n.jpg", { type: 'image/jpeg' });
            const f3 = new File(["blob"], "asdf.txt", { type: 'text/plain' });
            const validator = NgEzValidators.fileType('.jpg, .txt, audio/*');

            expect(validator(new FormControl(f1))).toBeNull();
            expect(validator(new FormControl(f2))).toBeNull();
            expect(validator(new FormControl(f3))).toBeNull();
            expect(validator(new FormControl([f3]))).toBeNull();
            expect(validator(new FormControl([f3, f3]))).toBeNull();
            expect(validator(new FormControl([f1, f3]))).toBeNull();
            expect(validator(new FormControl([f1, f2, f3]))).toBeNull();
        });
    });

    describe('maxSize()', () => {
        it('should return null if not passed a File, FileList or File[]', () => {
            const validator = NgEzValidators.maxSize(100000);
            expect(validator(new FormControl(null))).toBeNull();
            expect(validator(new FormControl(100))).toBeNull();
            expect(validator(new FormControl('some string'))).toBeNull();
            expect(validator(new FormControl({ name: 'filename' }))).toBeNull();
            expect(validator(new FormControl([]))).toBeNull();
            expect(validator(new FormControl([1]))).toBeNull();
            const file = new File(["blob"], "song.mp3", { type: 'audio/mp3' });
            expect(validator(new FormControl([1, file]))).toBeNull();
        });

        it('should return an error object if any of the file sizes exceed the limit.', () => {

            const f1 = new File([getRandomText(100000)], "file1.txt", { type: 'text/plain' });
            const f2 = new File([getRandomText(1000001)], "file2.txt", { type: 'text/plain' });
            const f3 = new File([getRandomText(10000000)], "file3.txt", { type: 'text/plain' });

            const validator = NgEzValidators.maxSize(NgEzByteUtils.convert(1, 'megabyte'));

            expect(validator(new FormControl(f3))).toBeTruthy();
            expect(validator(new FormControl([f3]))).toBeTruthy();
            expect(validator(new FormControl([f3, f3]))).toBeTruthy();
            expect(validator(new FormControl([f1, f3]))).toBeTruthy();
            expect(validator(new FormControl([f1, f2, f3]))).toBeTruthy();
        });

        it('should return an error object if provided a File and an array of errors if provided a FileList or File[]', () => {
            const f1 = new File([getRandomText(100000)], "file1.txt", { type: 'text/plain' });
            const f2 = new File([getRandomText(1000001)], "file2.txt", { type: 'text/plain' });
            const f3 = new File([getRandomText(10000000)], "file3.txt", { type: 'text/plain' });

            const requiredSize = NgEzByteUtils.convert(1, 'megabyte');

            const validator = NgEzValidators.maxSize(requiredSize);

            expect(validator(new FormControl(f3))).toEqual({ requiredSize, actualFile: f3 });
            expect(validator(new FormControl([f3]))).toEqual([{ requiredSize, actualFile: f3 }]);
            expect(validator(new FormControl([f3, f3]))).toEqual([{ requiredSize, actualFile: f3 }, { requiredSize, actualFile: f3 }]);
            expect(validator(new FormControl([f1, f3]))).toEqual([{ requiredSize, actualFile: f3 }]);
            expect(validator(new FormControl([f1, f2, f3]))).toEqual([{ requiredSize, actualFile: f2 }, { requiredSize, actualFile: f3 }]);
        });

        it('should return null if all the file sizes are valid.', () => {
            const f1 = new File([getRandomText(100000)], "file1.txt", { type: 'text/plain' });
            const f2 = new File([getRandomText(100000)], "file2.txt", { type: 'text/plain' });
            const f3 = new File([getRandomText(500)], "file3.txt", { type: 'text/plain' });

            const validator = NgEzValidators.maxSize(NgEzByteUtils.convert(1, 'megabyte'));

            expect(validator(new FormControl(f1))).toBeNull();
            expect(validator(new FormControl(f2))).toBeNull();
            expect(validator(new FormControl(f3))).toBeNull();
            expect(validator(new FormControl([f3]))).toBeNull();
            expect(validator(new FormControl([f3, f3]))).toBeNull();
            expect(validator(new FormControl([f1, f3]))).toBeNull();
            expect(validator(new FormControl([f1, f2, f3]))).toBeNull();
        });
    });

    describe('totalSize()', () => {
        it('should return null if not passed a File, FileList or File[]', () => {
            const validator = NgEzValidators.totalSize(100000);
            expect(validator(new FormControl(null))).toBeNull();
            expect(validator(new FormControl(100))).toBeNull();
            expect(validator(new FormControl('some string'))).toBeNull();
            expect(validator(new FormControl({ name: 'filename' }))).toBeNull();
            expect(validator(new FormControl([]))).toBeNull();
            expect(validator(new FormControl([1]))).toBeNull();
            const file = new File(["blob"], "song.mp3", { type: 'audio/mp3' });
            expect(validator(new FormControl([1, file]))).toBeNull();
        });

        it('should return an error object if the sum of all file sizes exceeds the limit.', () => {

            const f1 = new File([getRandomText(1000)], "file1.txt", { type: 'text/plain' });
            const f2 = new File([getRandomText(1000000)], "file2.txt", { type: 'text/plain' });
            const f3 = new File([getRandomText(1000001)], "file3.txt", { type: 'text/plain' });

            const validator = NgEzValidators.totalSize(NgEzByteUtils.convert(1, 'megabyte'));

            expect(validator(new FormControl(f3))).toBeTruthy();
            expect(validator(new FormControl([f3]))).toBeTruthy();
            expect(validator(new FormControl([f3, f3]))).toBeTruthy();
            expect(validator(new FormControl([f1, f3]))).toBeTruthy();
            expect(validator(new FormControl([f1, f2, f3]))).toBeTruthy();
        });

        it('should return null if the sum of all file sizes is valid.', () => {
            const f1 = new File([getRandomText(1)], "file1.txt", { type: 'text/plain' });
            const f2 = new File([getRandomText(1000000)], "file2.txt", { type: 'text/plain' });
            const f3 = new File([getRandomText(500)], "file3.txt", { type: 'text/plain' });

            const validator = NgEzValidators.totalSize(NgEzByteUtils.convert(1, 'megabyte'));

            expect(validator(new FormControl(f1))).toBeNull();
            expect(validator(new FormControl(f2))).toBeNull();
            expect(validator(new FormControl(f3))).toBeNull();
            expect(validator(new FormControl([f1]))).toBeNull();
            expect(validator(new FormControl([f2]))).toBeNull();
            expect(validator(new FormControl([f3]))).toBeNull();
            expect(validator(new FormControl([f3, f3]))).toBeNull();
            expect(validator(new FormControl([f1, f3]))).toBeNull();
        });
    });
});

function getRandomText(length: number) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}