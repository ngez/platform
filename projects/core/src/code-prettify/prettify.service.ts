import { Injectable } from "@angular/core";
import { $prettyPrintOne } from './prettify';

@Injectable()
export class PrettifyService {

    formatCode(code: string, language?: string, linenums?: number | boolean) {
        return $prettyPrintOne(this.encode(code), language, linenums);
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