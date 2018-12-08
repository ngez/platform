import { NgModule } from '@angular/core';
import { NgEzAutocompleteComponent } from './autocomplete.component';
import { NgEzAutocompleteDirective } from './autocomplete.directive';
import { Overlay } from '@angular/cdk/overlay';
import { NgEzAutocompleteOptionComponent } from './autocomplete-option.component';

@NgModule({
  declarations: [
    NgEzAutocompleteComponent, 
    NgEzAutocompleteDirective,
    NgEzAutocompleteOptionComponent
  ],
  exports: [NgEzAutocompleteComponent, NgEzAutocompleteDirective, NgEzAutocompleteOptionComponent],
  entryComponents: [NgEzAutocompleteComponent],
  providers: [Overlay]
})
export class NgEzAutocompleteModule { }
