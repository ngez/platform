import { NgEzByteUtils } from "./byte";

describe('NgEzByteUtils', () => {
    describe('convert()', () => {
        it('should return the same input if "to" and "from" params are undefined', () => {
            expect(NgEzByteUtils.convert(1000, null)).toBe(1000);
            expect(NgEzByteUtils.convert(1000, null, null)).toBe(1000);
            expect(NgEzByteUtils.convert(0, null, null)).toBe(0);
        });

        it('should return the input converted from the specified unit', () => {
            expect(NgEzByteUtils.convert(1, 'kilobyte')).toBe(1000);
            expect(NgEzByteUtils.convert(1.15, 'megabyte')).toBe(1150000);
            expect(NgEzByteUtils.convert(8.5, 'gigabyte')).toBe(8500000000);
            expect(NgEzByteUtils.convert(1, 'kibibyte')).toBe(1024);
            expect(NgEzByteUtils.convert(2, 'kibibyte')).toBe(2048);
        });

        it('should return the input converted from a specified unit to a specified unit', () => {
            expect(NgEzByteUtils.convert(1, 'kilobyte', 'byte')).toBe(1000);
            expect(NgEzByteUtils.convert(1000, 'kilobyte', 'megabyte')).toBe(1);
            expect(NgEzByteUtils.convert(1, 'megabyte', 'mebibyte')).toBe(0.95367431640625);
            expect(NgEzByteUtils.convert(1000000, null, 'megabyte')).toBe(1);
            expect(NgEzByteUtils.convert(1000000, 'byte', 'megabyte')).toBe(1);
            expect(NgEzByteUtils.convert(1, 'gibibyte', 'mebibyte')).toBe(1024);
        });
    });
})