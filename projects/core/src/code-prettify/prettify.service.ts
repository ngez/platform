import { Injectable } from "@angular/core";
import 'code-prettify/src/prettify';

@Injectable()
export class PrettifyService {

    formatCode(code: string, language?: string, linenums?: number | boolean) {
        const { PR: { prettyPrintOne } = { prettyPrintOne: null }} = window as any;

        return prettyPrintOne(this.encode(code), language, linenums);
    }

    private encode(value: string){
        return value
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
}