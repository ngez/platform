import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'test',
    template: 'test component'
})
export class TestComponent implements OnInit{

    ngOnInit() {
        console.log('running ngOnInit()')
    }

}