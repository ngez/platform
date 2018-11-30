import { NgModule } from '@angular/core';
import { NgEzAutocompleteComponent } from './autocomplete.component';
import { NgEzAutocompleteDirective } from './autocomplete.directive';
import { Overlay } from '@angular/cdk/overlay';
import { NgEzOptionModule } from '../option';

@NgModule({
  declarations: [
    NgEzAutocompleteComponent, 
    NgEzAutocompleteDirective
  ],
  imports: [
    NgEzOptionModule
  ],
  exports: [NgEzAutocompleteComponent, NgEzAutocompleteDirective, NgEzOptionModule],
  entryComponents: [NgEzAutocompleteComponent],
  providers: [Overlay]
})
export class NgEzAutocompleteModule { }
