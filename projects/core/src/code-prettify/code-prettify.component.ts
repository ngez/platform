import { 
    Component, 
    Input, 
    ViewEncapsulation, 
    ViewChild, 
    ElementRef, 
    ContentChild,  
    AfterContentInit, 
    Output, 
    EventEmitter, 
    OnDestroy, 
    HostBinding,
    OnChanges,
    OnInit,
    PLATFORM_ID, 
    Inject} from "@angular/core";
import { PrettifyService } from "./prettify.service";
import { CodeService } from "./code.service";
import { map, switchMap, tap, delay } from "rxjs/operators";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { NgEzCodeLoadingComponent } from "./code-loading.component";
import { NgEzCodeLoadingErrorComponent } from "./code-loading-error.component";
import { Observable, of, Subscription } from "rxjs";
import { NgEzCodePrettifyConfig } from "./models";
import { NgEzReloadDirective } from "./reload.directive";
import { faClone, IconDefinition } from '@fortawesome/free-regular-svg-icons';
import { isPlatformBrowser } from "@angular/common";

@Component({
    selector: 'ngez-code-prettify',
    templateUrl: './code-prettify.component.html',
    styleUrls: ['./code-prettify.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NgEzCodePrettifyComponent implements OnChanges, OnInit, AfterContentInit, OnDestroy {

    @Input() config: NgEzCodePrettifyConfig;

    @Input() loading: boolean;

    @Input() error: boolean;

    @Output() reload = new EventEmitter();

    @ViewChild('pre') pre: ElementRef;

    @ContentChild(NgEzCodeLoadingComponent) codeLoadingComponent: NgEzCodeLoadingComponent;

    @ContentChild(NgEzCodeLoadingErrorComponent) codeLoadingErrorComponent: NgEzCodeLoadingErrorComponent;

    @HostBinding('class') get classes(): string {
        return this.config && this.config.theme ? this.config.theme : 'dark';
    }

    faClone: IconDefinition = faClone;

    _code: string;
    
    _loading = false;

    _error = false;

    prettifiedCode$: Observable<SafeHtml>;

    private subscription: Subscription;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private sanitizer: DomSanitizer,
        private prettify: PrettifyService,
        private service: CodeService) { }

    ngOnChanges() {
        this.update();
    }

    ngOnInit() {
        this.update();
    }

    ngAfterContentInit() {
        if (!this.codeLoadingErrorComponent || !this.codeLoadingErrorComponent.reloadDirective)
            return;
        this.subscription = this.codeLoadingErrorComponent.reloadDirective.reload.subscribe(() => {
            this.reload.emit();
            this.update();
        });
    }

    ngOnDestroy() {
        if(this.subscription)
            this.subscription.unsubscribe();
    }

    private update() {

        if (!isPlatformBrowser(this.platformId) || !this.config || !(this.config.code || this.config.path))
            return;

        this._loading = true;
        this._error = false;

        const code$ = this.config.code
            ? of(this.config.code)
            : this.service.get(this.config.path);

        const prettifiedCode$ = code$.pipe(
            tap(code => this._code = code),
            map(code => this.prettify.formatCode(code, this.config.language, this.config.linenums)),
            map(code => this.sanitizer.bypassSecurityTrustHtml(code)),
            tap(() => this._loading = false, () => {
                this._loading = false;
                this._error = true;
            })
        );

        this.prettifiedCode$ = prettifiedCode$;
    }

    get isLoading(): boolean {
        return this.loading || this._loading;
    }

    get hasError(): boolean {
        return this.error || this._error;
    }
}