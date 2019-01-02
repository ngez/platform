import { Injectable, Optional, PLATFORM_ID, Inject } from "@angular/core";
import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import { WINDOW } from "../window/window.service";

@Injectable()
export class NgEzClipboardService{

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(WINDOW) private window: any,
        @Optional() @Inject(DOCUMENT) private document: any){}

    copy(payload: string): boolean{
        if(!isPlatformBrowser(this.platformId)) return false;

        const textarea = this.createTextarea(payload);

        this.appendTextarea(textarea);

        const selected = this.getSelection();

        this.select(textarea, payload);

        const didCopy = document.execCommand('copy');

        this.removeTextarea(textarea);

        this.restoreSelection(selected);

        return didCopy && this.didCopyInIE11();
    }    

    private getSelection(): Range | false {
        const documentSelection = document.getSelection();
        return documentSelection.rangeCount > 0 ? documentSelection.getRangeAt(0) : false;
    }

    private select(textarea: HTMLTextAreaElement, payload: string) {
        textarea.select();
        textarea.selectionStart = 0;
        textarea.selectionEnd = payload.length;
    }

    private createTextarea(payload: string){
        const textarea: HTMLTextAreaElement = this.document.createElement('textarea');
        textarea.value = payload;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        return textarea;
    }

    private appendTextarea(textarea: HTMLTextAreaElement){
        this.document.body.appendChild(textarea);
    }

    private removeTextarea(textarea: HTMLTextAreaElement) {
        this.document.body.removeChild(textarea);
    }

    private restoreSelection(selected: Range | false) {
        if(!selected) return;
        
        const documentSelection = this.document.getSelection();
        documentSelection.removeAllRanges();
        documentSelection.addRange(selected);
    }

    private didCopyInIE11(){
        const clipboardData = this.window['clipboardData'];
        if (clipboardData && clipboardData.getData && !clipboardData.getData('text'))
            return false;
        return true;
    }
}