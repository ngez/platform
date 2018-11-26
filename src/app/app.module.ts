import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NgEzAutocompleteModule } from 'projects/ngez/core/src/public_api';
import { ReactiveFormsModule } from '@angular/forms';
// import { NgEzAutocompleteModule } from '@ngez/core';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgEzAutocompleteModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
