import { Input } from '@angular/core';

export abstract class NgEzFileBase{

    @Input() accept: string;

    @Input() set multiple(multiple){
        this._multiple = multiple;
    };

    get multiple(){
        const multiple = this._multiple;
        return multiple || multiple === '' ? true : false;
    }

    private _multiple: any;

    protected fileInput: HTMLInputElement;

    protected listener: Function;
}