import { Input } from "@angular/core";

export abstract class NgEzFileBase{

    @Input() accept: string;

    protected fileInput: HTMLInputElement;

    protected listener: Function;
}