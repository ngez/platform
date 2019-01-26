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
    SimpleChanges
} from "@angular/core";
import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Subscription, fromEvent } from "rxjs";
import { NgEzFileBase } from "./file";

@Directive({
    selector: ':not([type="file"])[ngezFileInput]',
    exportAs: 'ngezFileInput',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NgEzFileInputDirective),
        multi: true
    }]
})
export class NgEzFileInputDirective extends NgEzFileBase implements ControlValueAccessor, OnChanges, OnInit, OnDestroy {

    @Input() set multiple(multiple){
        this._multiple = multiple;
    };

    @Output() selected = new EventEmitter<File | File[]>();

    private _multiple: any;
    
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
        private renderer: Renderer2) { super(); }

    ngOnChanges(changes: SimpleChanges) {
        if (!isPlatformBrowser(this.platformId)) return;

        const { currentValue: accept = null, previousValue: prevAccept = null } = changes.accept || {};
        const { currentValue: multiple = null, previousValue: prevMultiple = null } = changes.multiple || {};

        if ((multiple != prevMultiple) || (accept != prevAccept))
            this.appendFileInput();
    }

    ngOnInit() {
        if (!isPlatformBrowser(this.platformId)) return;

        if (!this.fileInput)
            this.appendFileInput();

        this.subscription = fromEvent(this.element.nativeElement, this.isInputOrTextarea() ? 'focus' : 'click')
            .subscribe(e => this.open());
    }

    ngOnDestroy() {
        if (this.subscription)
            this.subscription.unsubscribe();
        this.removeFileInput();
    }

    @HostListener('blur')
    private onBlur() {
        if (this.onTouched)
            this.onTouched();
    }

    open() {
        if(this.isDisabled) return;

        if (this.isInputOrTextarea())
            this.element.nativeElement.blur();
            
        this.fileInput.click();
    }

    clear() {
        this.setValueAndUpdate(null);
    }

    writeValue(value: any): void {
        let file: File | File[] = null;

        if (value) {
            if (value instanceof File || (Array.isArray(value) && value.every(value => value instanceof File)))
                file = value;
            else if (value instanceof FileList)
                file = Array.from(value);
            else
                return console.warn('Expected value of type File, FileList or File[], instead got: ', value);
        }

        this.setValue(file);
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

    private setValue(value: File | File[]) {
        const text = value ? this.getText(value) : '';
        this.renderer.setProperty(this.element.nativeElement, 'value', text);
    }

    private setValueAndUpdate(value: File | FileList) {
        const fileValue = value instanceof FileList ? Array.from(value) : value;
        if (this.onChange)
            this.onChange(fileValue);
        this.setValue(fileValue);
        this.selected.emit(fileValue);
    }

    private appendFileInput() {
        if (this.fileInput)
            this.clear();

        this.removeFileInput();

        this.fileInput = this.createFileInput();
        this.renderer.appendChild(this.document.body, this.fileInput);
        this.listener = this.renderer.listen(this.fileInput, 'change', e => {
            const files: FileList = e.target.files;
            const value = this.multiple ? files : files.item(0);
            this.setValueAndUpdate(value);
        });
    }

    private createFileInput(): HTMLInputElement {
        const input = this.renderer.createElement('input');
        this.renderer.setAttribute(input, 'type', 'file');
        this.renderer.setAttribute(input, 'aria-hidden', 'true');
        this.renderer.setProperty(input, 'hidden', true);
        this.renderer.setProperty(input, 'multiple', this.multiple ? true : false);
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

    private getText(value: File | File[]): string {
        const files = value instanceof File ? [value] : value;
        return files.reduce((text, file, index) => `${text}${index > 0 ? ', ' : ''}${file.name}`, '');
    }

    private isInputOrTextarea(): boolean {
        const element = this.element.nativeElement;
        return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement;
    }

    get multiple(){
        const multiple = this._multiple;
        return multiple || multiple === '' ? true : false;
    }
}