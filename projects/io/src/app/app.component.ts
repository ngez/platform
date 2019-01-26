import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { debounceTime, map, tap, filter, switchMap } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MediaObserver } from '@angular/flex-layout';
import { Observable } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, NavigationEnd } from '@angular/router';
import { MatIconRegistry } from '@angular/material';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { DomSanitizer } from '@angular/platform-browser';

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

  constructor(public observer: MediaObserver, private router: Router, private sanitizer: DomSanitizer, iconRegistry: MatIconRegistry) {
    const { icon, iconName, prefix } = faGithub;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${icon[0]} ${icon[1]}"><path d="${icon[4]}" /></svg>`;
    iconRegistry.addSvgIconLiteralInNamespace(prefix, iconName, sanitizer.bypassSecurityTrustHtml(svg))
  }

  ngOnInit() {
    this.mode$ = this.observer.media$.pipe(
      map(() => this.observer.isActive('gt-sm') ? 'side' : 'over')
    );

    // this.router.events
    //   .pipe(filter(e => e instanceof NavigationEnd))
    //   .subscribe(e => {
    //     const isLarge = this.media.isActive('gt-sm');
    //     if (isLarge && !this.snav.opened)
    //       this.snav.open();
    //     if (!isLarge && this.snav.opened)
    //       this.snav.close();
    //   });
  }

}
