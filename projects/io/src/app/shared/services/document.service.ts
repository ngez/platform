import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import 'code-prettify/src/run_prettify';

@Injectable({
    providedIn: 'root'
})
export class DocumentService{

    constructor(private http: HttpClient){}

    get(){
        console.log((window as any)['PR']);
        return this.http.get('/assets/code-snippets/core/app.component.ts', {responseType: 'text'})
    }
}