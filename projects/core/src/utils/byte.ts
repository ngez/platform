import { NgEzByteUnit } from "../file/models";

export class NgEzByteUtils{

    private static decimalUnits = [
        'kilobyte', 
        'megabyte', 
        'gigabyte', 
        'terabyte'];

    private static binaryUnits = [
        'kibibyte', 
        'mebibyte', 
        'gibibyte', 
        'tebibyte'];

    static convert(input: number, from: NgEzByteUnit, to?: NgEzByteUnit){

        if(!input || (!from && !to))
            return input;

        const fromBytes = from && from != 'byte' ? this.toBytes(from) : 1;

        const toBytes = to && to != 'byte' ? this.toBytes(to) : 1;

        return input * (fromBytes / toBytes);
    }

    private static toBytes(unit: NgEzByteUnit){

        {
            const power = this.decimalUnits.findIndex(decimalUnit => decimalUnit == unit) + 1;
            if(power)
                return Math.pow(1000, power);
        }

        {
            const power = this.binaryUnits.findIndex(binaryUnit => binaryUnit == unit) + 1;
            if(power)
                return Math.pow(1024, power);
        }

        return 1;
    }
}