import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgEzAutocompleteConfig, NgEzAutocompleteDirective } from '@ngez/core'
import { debounceTime, map, tap, filter, switchMap } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ObservableMedia } from '@angular/flex-layout';
import { Observable } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild(MatSidenav) snav: MatSidenav;

  mode$: Observable<'side' | 'over'>;

  routerLinkOptions = {
    exact: true
  };

  constructor(public media: ObservableMedia, private router: Router) { }

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

  ngOnInit() {
    this.mode$ = this.media.asObservable().pipe(
      map(() => this.media.isActive('gt-sm') ? 'side' : 'over')
    );

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(e => {
        const isLarge = this.media.isActive('gt-sm');
        if (isLarge && !this.snav.opened)
          this.snav.open();
        if (!isLarge && this.snav.opened)
          this.snav.close();
      });
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
