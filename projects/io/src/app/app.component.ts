import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
// import { 
//   NgEzAutocompleteDirective, 
//   NgEzAutocompleteConfig } from 'projects/ngez/core/src/public_api';
import { NgEzAutocompleteConfig, NgEzAutocompleteDirective} from '@ngez/core'
import { debounceTime, map } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as faker from 'faker';
import { ObservableMedia } from '@angular/flex-layout';
import { Observable } from 'rxjs';
import { DocumentService } from './shared/services/document.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  mode$: Observable<'side' | 'over'>;

  isVisible = false

  constructor(public media: ObservableMedia, private documentService: DocumentService) {
    this.documentService.get().subscribe(text => console.log(text))
  }

  // form: FormGroup;

  // options;

  // config: NgEzAutocompleteConfig = {
  //   labelExtractor: option => option.username
  // }

  // @ViewChild(NgEzAutocompleteDirective) autocomplete: NgEzAutocompleteDirective;

  // constructor(fb: FormBuilder){
  //   this.setOptions();
  //   this.form = fb.group({
  //     autocomplete: null
  //   })
  // }

  ngOnInit(){
    this.mode$ = this.media.asObservable().pipe(
      map(() => this.media.isActive('gt-sm') ? 'side' : 'over')
    );
    
    //setInterval(() => this.setOptions(), 3000)
  }

  // setOptions(){
  //   const options = [];
  //   for(let i = 0; i < 100; i++){
  //     const user = {
  //       id: faker.random.uuid(),
  //       username: faker.internet.userName(),
  //       avatar: faker.internet.avatar()
  //     }
  //     options.push(user)
  //   }

  //   this.options = options;
  // }
}
