import { NgModule } from '@angular/core';
import { AutocompleteComponent } from './autocomplete.component';
import { AutocompleteDirective } from './autocomplete.directive';
import { Overlay } from '@angular/cdk/overlay';
//import { OptionModule } from '../../../core/src/lib/components/option/option.module';
import {  } from '@ngez/core';

@NgModule({
  declarations: [
    AutocompleteComponent, 
    AutocompleteDirective
  ],
  imports: [
    OptionModule
  ],
  exports: [AutocompleteComponent, AutocompleteDirective],
  entryComponents: [AutocompleteComponent],
  providers: [Overlay]
})
export class AutocompleteModule { }
