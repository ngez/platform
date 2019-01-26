import { Directive, HostListener, HostBinding, forwardRef, Output, EventEmitter } from "@angular/core";
import { NgEzFileBase } from "./file";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Directive({
    selector: '[ngezFileDropzone]',
    exportAs: 'ngezFileDropzone',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NgEzFileDropzoneDirective),
        multi: true
    }]
})
export class NgEzFileDropzoneDirective extends NgEzFileBase implements ControlValueAccessor{

    @HostBinding('class.ngez-file-dropzone') className = true;

    @HostBinding('class.active') get isActive(){
        return this._isActive && !this.isDisabled;
    }

    @HostBinding('class.disabled') isDisabled = false;

    @Output() dropped = new EventEmitter<File[]>();

    @Output() selected = new EventEmitter<File[]>();

    value: File[] = [];

    onChange: Function;

    onTouched: Function;

    private _isActive = false;

    constructor(){ super(); }

    @HostListener('dragenter', ['$event'])
    onDragEnter(e){
        this._isActive = true;
    }

    @HostListener('dragleave', ['$event'])
    onDragLeave(e){
        this._isActive = false;
    }

    @HostListener('dragover', ['$event'])
    onDragOver(e){
        e.stopPropagation();
        e.preventDefault();
    }

    @HostListener('drop', ['$event'])
    async onDrop(e: any){
        e.stopPropagation();
        e.preventDefault();
        this._isActive = false;

        if(this.isDisabled)
            return;

        const dataTransfer: DataTransfer = e.dataTransfer;
        const items = dataTransfer.items;
        
        try{
            const files = await (items
                ? this.getFilesFromDataTransferItemList(items)
                : Promise.resolve(Array.from(dataTransfer.files)));

            this.setValueAndUpdate(files);
            
        } catch(e){
            console.error(e);
        }
    }

    writeValue(value: any): void {
        this.value = [];
        let files: File[] = null;

        if (value) {
            if(value instanceof File)
                files = [value];
            else if (Array.isArray(value) && value.every(value => value instanceof File))
                files = value;
            else if (value instanceof FileList)
                files = Array.from(value);
            else
                return console.warn('Expected value of type File, FileList or File[], instead got: ', value);
        }

        this.setValue(files);
    }

    registerOnChange(fn: (value: any) => {}): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => {}) {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean) {
        this.isDisabled = isDisabled;
    }

    private async getFilesFromDataTransferItemList(dataTransferItemList: DataTransferItemList): Promise<File[]>{
        const items = Array.from(dataTransferItemList);
        
        const promises = items.map(item => {
            const entry = item.webkitGetAsEntry();
            return entry ? this.getAllFiles(entry) : [item.getAsFile()];
        });

        const files = await Promise.all(promises);
        
        return files.reduce((acc, files) => [...acc, ...files], []);      
    }

    private async getAllFiles(entry) {
        if(entry.isFile)
            return [await this.getFileFromEntry(entry)];

        if(entry.isDirectory){
            const entries = await this.readAllDirectoryEntries(entry.createReader());

            return entries.reduce(async (acc:  Promise<File[]>, entry) => {
                const files = await acc;

                return [...files, ... (await this.getAllFiles(entry))];
            }, Promise.resolve([]));
        }

        return [];   
    }

    private getFileFromEntry(entry) : Promise<File>{
        return new Promise((resolve, reject) => entry.file(resolve, reject));
    }

    private readAllDirectoryEntries(directoryReader): Promise<any[]>{
        return new Promise((resolve, reject) => directoryReader.readEntries(resolve, reject));
    }

    private setValue(files: File[]) {
        this.value = [...this.value, ...(files ? files : [])];
    }

    private setValueAndUpdate(files: File[]) {
        this.setValue(files);
        if(this.onTouched)
            this.onTouched();
        if(this.onChange)
            this.onChange(this.value);
        this.dropped.emit(files);
        this.selected.emit(this.value);
    }
}