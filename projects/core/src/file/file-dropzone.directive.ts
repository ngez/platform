import { 
    Directive, 
    HostListener, 
    HostBinding, 
    forwardRef, 
    Output, 
    EventEmitter, 
    Inject, 
    Optional, 
    PLATFORM_ID, 
    Renderer2, 
    OnChanges, 
    SimpleChanges,
    OnInit,
    OnDestroy,
    Input,
    ElementRef} from "@angular/core";
import { NgEzFileBase } from "./file";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { 
    NgEzFileDropzoneEvent, 
    NgEzFileDropzoneEventTypes } from './models';

@Directive({
    selector: '[ngezFileDropzone]',
    exportAs: 'ngezFileDropzone',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NgEzFileDropzoneDirective),
        multi: true
    }]
})
export class NgEzFileDropzoneDirective extends NgEzFileBase implements ControlValueAccessor, OnChanges, OnInit, OnDestroy{

    @Output() changed = new EventEmitter<NgEzFileDropzoneEvent>();
    
    @HostBinding('class.ngez-file-dropzone') className = true;

    @HostBinding('class.active') get isActive(){
        return this._isActive && !this.isDisabled;
    }

    @HostBinding('class.disabled') isDisabled = false;

    value: File[] = [];

    onChange: Function;

    onTouched: Function;

    private _isActive = false;

    private target: EventTarget;

    constructor(
        private element: ElementRef,
        @Inject(PLATFORM_ID) private platformId: Object,
        @Optional() @Inject(DOCUMENT) private document: any,
        private renderer: Renderer2){ super(); }

    ngOnChanges(changes: SimpleChanges) {
        if (!isPlatformBrowser(this.platformId)) return;

        const { currentValue: accept = null, previousValue: prevAccept = null } = changes.accept || {};

        if (accept != prevAccept)
            this.appendFileInput();
    }

    ngOnInit() {
        if (!isPlatformBrowser(this.platformId)) return;

        if (!this.fileInput)
            this.appendFileInput();
    }

    ngOnDestroy() {
        this.removeFileInput();
    }

    @HostListener('dragenter', ['$event.target'])
    onDragEnter(target){
        this.target = target;
        this._isActive = true;
    }

    @HostListener('dragleave', ['$event.target'])
    onDragLeave(target){
        if(this.target == target)
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

            this.setValueAndUpdate(files, 'drop');
            
        } catch(e){
            console.error(e);
        }
    }

    browse() {
        if(this.isDisabled || !this.fileInput) return;
            
        this.fileInput.click();
    }

    writeValue(value: any): void {
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
        this.value = files ? files : [];
    }

    private setValueAndEmit(files: File[], event: NgEzFileDropzoneEventTypes) {
        this.setValue(files);
        this.changed.emit(new NgEzFileDropzoneEvent(event, files));
    }

    private setValueAndUpdate(files: File[], event: NgEzFileDropzoneEventTypes) {
        this.setValueAndEmit([...this.value, ...(files ? files : [])], event);

        if(this.onTouched)
            this.onTouched();
        if(this.onChange)
            this.onChange(this.value);
    }

    private appendFileInput() {
        if (this.fileInput)
            this.clear();

        this.removeFileInput();

        this.fileInput = this.createFileInput();
        this.renderer.appendChild(this.document.body, this.fileInput);
        this.listener = this.renderer.listen(this.fileInput, 'change', e => {
            const files: FileList = e.target.files;
            this.setValueAndUpdate(Array.from(files), 'select');
        });
    }

    private createFileInput(): HTMLInputElement {
        const input = this.renderer.createElement('input');
        this.renderer.setAttribute(input, 'type', 'file');
        this.renderer.setAttribute(input, 'aria-hidden', 'true');
        this.renderer.setProperty(input, 'hidden', true);
        this.renderer.setProperty(input, 'multiple', true);
        if (this.accept)
            this.renderer.setAttribute(input, 'accept', this.accept);
        return input;
    }

    private removeFileInput() {
        if (this.fileInput)
            this.renderer.removeChild(this.document.body, this.fileInput);
        if (this.listener)
            this.listener();
    }

    private clear() {
        this.setValue([]);
    }
}