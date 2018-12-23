import { Injectable, Optional, PLATFORM_ID, Inject } from "@angular/core";
import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import { WINDOW } from "./window.service";

@Injectable()
export class NgEzClipboardService{

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(WINDOW) private window: any,
        @Optional() @Inject(DOCUMENT) private document: any){}

    copy(payload: string){
        if(!isPlatformBrowser(this.platformId)) return;

        const listener = (e: ClipboardEvent) => {
            const clipboard = e.clipboardData || window["clipboardData"];
            clipboard.setData("text", payload);
            e.preventDefault();
        };

        this.document.addEventListener("copy", listener, false)
        this.document.execCommand("copy");
        this.document.removeEventListener("copy", listener, false);
    }
}