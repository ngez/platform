import { Component, ViewChild } from '@angular/core';
import { 
  NgEzAutocompleteDirective, 
  NgEzAutocompleteConfig } from 'projects/ngez/core/src/public_api';
import { debounceTime } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  form: FormGroup;

  options = [{name: 'Christian'}, {name: 'Testing'}];

  config: NgEzAutocompleteConfig = {
    labelExtractor: option => option.name
  }

  @ViewChild(NgEzAutocompleteDirective) autocomplete: NgEzAutocompleteDirective;

  constructor(fb: FormBuilder){
    this.form = fb.group({
      autocomplete: {name: 'Christian'}
    })
  }

  ngOnInit(){
    
    // setTimeout(() => {
    //   this.options = [{name: 'Christian'}]
    // }, 1000)
  }

  ngAfterViewInit(){
    this.autocomplete.open()
  }
}
