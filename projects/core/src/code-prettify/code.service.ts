import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class CodeService{

    constructor(private http: HttpClient){}

    get(path: string){
        return this.http.get(path, {responseType: 'text'})
    }
}