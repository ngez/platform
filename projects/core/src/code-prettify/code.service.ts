import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class CodeService{

    constructor(private http: HttpClient){}

    get(path: string): Observable<string>{
        return this.http.get(path, {responseType: 'text'})
    }
}