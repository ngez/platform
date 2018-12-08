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
    OnInit} from "@angular/core";
import { PrettifyService } from "./prettify.service";
import { CodeService } from "./code.service";
import { map, switchMap, tap, delay } from "rxjs/operators";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { NgEzCodeLoadingComponent } from "./code-loading.component";
import { NgEzCodeLoadingErrorComponent } from "./code-loading-error.component";
import { Observable, of, Subscription } from "rxjs";
import { NgEzCodePrettifyOptions } from "./models";
import { NgEzReloadDirective } from "./reload.directive";
// import { faClone } from '@fortawesome/free-solid-svg-icons';
import { faClone } from '@fortawesome/free-regular-svg-icons';

@Component({
    selector: 'ngez-code-prettify',
    templateUrl: './code-prettify.component.html',
    styleUrls: ['./code-prettify.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NgEzCodePrettifyComponent implements OnChanges, OnInit, AfterContentInit, OnDestroy {

    @Input() options: NgEzCodePrettifyOptions;

    @Input() loading: boolean;

    @Input() error: boolean;

    @Output() reload = new EventEmitter();

    @ViewChild('pre') pre: ElementRef;

    @ContentChild(NgEzCodeLoadingComponent) codeLoadingComponent: NgEzCodeLoadingComponent;

    @ContentChild(NgEzCodeLoadingErrorComponent) codeLoadingErrorComponent: NgEzCodeLoadingErrorComponent;

    @HostBinding('class') get classes(): string {
        return this.options && this.options.theme ? this.options.theme : 'dark';
    }

    faClone = faClone;

    _code: string;
    
    _loading = false;

    _error = false;

    prettifiedCode$: Observable<SafeHtml>;

    private subscription: Subscription;

    constructor(
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

        if (!this.options || !(this.options.code || this.options.path))
            return;

        this._loading = true;
        this._error = false;

        const code$ = this.options.code
            ? of(this.options.code)
            : this.service.get(this.options.path);

        const prettifiedCode$ = code$.pipe(
            tap(code => this._code = code),
            map(code => this.prettify.formatCode(code, this.options.language, this.options.linenums)),
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