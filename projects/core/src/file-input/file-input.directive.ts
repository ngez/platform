import { 
    Directive, 
    ElementRef, 
    OnInit, 
    Renderer2, 
    Optional, 
    Inject, 
    PLATFORM_ID, 
    OnDestroy, 
    HostListener, 
    Input, 
    forwardRef,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges} from "@angular/core";
import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import { NgEzFileInputConfig } from "./models";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Subscription, fromEvent } from "rxjs";

@Directive({
    selector: ':not([type="file"])[ngezFileInput]',
    exportAs: 'ngezFileInput',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NgEzFileInputDirective),
        multi: true
    }]
})
export class NgEzFileInputDirective implements ControlValueAccessor, OnChanges, OnInit, OnDestroy {

    @Input() config: NgEzFileInputConfig;

    @Output() selected = new EventEmitter<File | FileList>();

    onChange: Function;

    onTouched: Function;

    isDisabled = false;

    private fileInput: HTMLInputElement;

    private listener: Function;

    private subscription: Subscription;

    constructor(
        private element: ElementRef,
        @Inject(PLATFORM_ID) private platformId: Object,
        @Optional() @Inject(DOCUMENT) private document: any,
        private renderer: Renderer2) {}

    ngOnChanges(changes: SimpleChanges) {
        if (!isPlatformBrowser(this.platformId)) return;
        
        const current: NgEzFileInputConfig = changes.config.currentValue;
        const previous: NgEzFileInputConfig = changes.config.previousValue;

        if((current && !previous) 
            || (current && previous && current.multiple != previous.multiple) 
            || (!current && previous && previous.multiple)
            || (current && previous && current.accept != previous.accept)
            || (!current && previous && previous.accept))
                this.appendFileInput();
    }

    ngOnInit() {
        if (!isPlatformBrowser(this.platformId)) return;

        if(!this.fileInput)
            this.appendFileInput();
        
        this.subscription = fromEvent(this.element.nativeElement, this.isInputOrTextarea() ? 'focus': 'click')
            .subscribe(e => this.open());
    }

    ngOnDestroy() {
        if(this.subscription)
            this.subscription.unsubscribe();
        this.removeFileInput();
    }

    @HostListener('blur')
    private onBlur(){
        if(this.onTouched)
            this.onTouched();
    }

    open() {
        if(this.isInputOrTextarea())
            this.element.nativeElement.blur();
        this.fileInput.click();
    }

    clear() {
        this.setValueAndUpdate(null);
    }

    writeValue(value: any): void {
        if(value && !(value instanceof File || value instanceof FileList))
            console.warn(value, 'is not an instance of File or FileList');
        else
            this.setValue(value);
    }

    registerOnChange(fn: (value: any) => {}): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => {}) {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean) {
        this.renderer.setProperty(this.element.nativeElement, 'disabled', isDisabled);
        this.isDisabled = isDisabled;
    }

    private setValue(value: File | FileList){
        const text = value ? this.getText(value) : '';
        this.renderer.setProperty(this.element.nativeElement, 'value', text);
    }

    private setValueAndUpdate(value: File | FileList) {
        if(this.onChange)
            this.onChange(value);
        this.setValue(value);
        this.selected.emit(value);
    }

    private appendFileInput() {
        if(this.fileInput)
            this.clear();

        this.removeFileInput();

        this.fileInput = this.createFileInput();
        this.renderer.appendChild(this.document.body, this.fileInput);
        this.listener = this.renderer.listen(this.fileInput, 'change', e => {
            const files: FileList = e.target.files;
            const value = this.config && this.config.multiple ? files : files.item(0);
            this.setValueAndUpdate(value);
        });
    }

    private createFileInput(): HTMLInputElement {
        const input = this.renderer.createElement('input');
        this.renderer.setAttribute(input, 'type', 'file');
        this.renderer.setAttribute(input, 'aria-hidden', 'true');
        this.renderer.setProperty(input, 'hidden', true);
        this.renderer.setProperty(input, 'multiple', this.config && this.config.multiple ? true : false);
        if(this.config && this.config.accept)
            this.renderer.setAttribute(input, 'accept', this.config.accept);
        return input;
    }

    private removeFileInput() {
        if (this.fileInput)
            this.renderer.removeChild(this.document.body, this.fileInput);
        if(this.listener)
            this.listener();
    }

    private getText(value: File | FileList): string {
        const files = value instanceof FileList ? Array.from(value) : [value];
        return files.reduce((text, file, index) => `${text}${index > 0 ? ', ': ''}${file.name}`, '');
    }

    private isInputOrTextarea(): boolean {
        const element = this.element.nativeElement;
        return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement;
    }
}