import { Pipe, PipeTransform } from "@angular/core";
import { NgEzByteUnit, NgEzByteUtils } from "../../utils";

@Pipe({
    name: 'ngezBytes'
})
export class NgEzBytesPipe implements PipeTransform{

    transform(value: number, from: NgEzByteUnit, to?: NgEzByteUnit){
        if(!value) return value;
        
        return NgEzByteUtils.convert(value, from, to);
    }
}