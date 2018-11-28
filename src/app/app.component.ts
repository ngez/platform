import { Component, ViewChild } from '@angular/core';
// import { 
//   NgEzAutocompleteDirective, 
//   NgEzAutocompleteConfig } from 'projects/ngez/core/src/public_api';
import { NgEzAutocompleteConfig, NgEzAutocompleteDirective} from '@ngez/core'
import { debounceTime } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as faker from 'faker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  form: FormGroup;

  options;

  config: NgEzAutocompleteConfig = {
    labelExtractor: option => option.username
  }

  @ViewChild(NgEzAutocompleteDirective) autocomplete: NgEzAutocompleteDirective;

  constructor(fb: FormBuilder){
    this.setOptions();
    this.form = fb.group({
      autocomplete: null
    })
  }

  ngOnInit(){
    this.form.valueChanges.subscribe(value => console.log(value));
    
    //setInterval(() => this.setOptions(), 3000)
  }

  setOptions(){
    const options = [];
    for(let i = 0; i < 100; i++){
      const user = {
        id: faker.random.uuid(),
        username: faker.internet.userName(),
        avatar: faker.internet.avatar()
      }
      options.push(user)
    }

    this.options = options;
  }
}
