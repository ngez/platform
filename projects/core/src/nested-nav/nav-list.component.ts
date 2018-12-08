import { Component, Input, ContentChildren, QueryList, AfterContentInit, OnInit, OnDestroy, OnChanges } from "@angular/core";
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { RouterLink, RouterLinkWithHref, Router, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";

@Component({
    selector: 'ngez-nav-list',
    templateUrl: './nav-list.component.html',
    styleUrls: ['./nav-list.component.scss']
})
export class NgEzNavListComponent implements OnChanges, OnInit, AfterContentInit, OnDestroy {

    @Input() title: string;

    @Input() routerLinkActiveOptions: { exact: boolean } = { exact: false };

    @ContentChildren(NgEzNavListComponent) lists: QueryList<NgEzNavListComponent>;

    @ContentChildren(RouterLink) links: QueryList<RouterLink>;

    @ContentChildren(RouterLinkWithHref) linksWithHrefs: QueryList<RouterLinkWithHref>;

    faAngleUp = faAngleUp;

    faAngleDown = faAngleDown;

    open: boolean = false;

    active: boolean = false;

    navigationSubscription: Subscription;

    linksQueryListChangesSubscription: Subscription;

    linksWithHrefsQueryListChangesSubscription: Subscription;

    constructor(private router: Router) { }

    ngOnChanges() {
        this.update();
    }

    ngOnInit() {
        this.navigationSubscription = this.router.events
            .pipe(filter(e => e instanceof NavigationEnd))
            .subscribe(e => this.update())
    }

    ngAfterContentInit() {
        this.linksQueryListChangesSubscription = 
            this.links.changes.subscribe((c) => this.update());
        this.linksWithHrefsQueryListChangesSubscription = 
            this.linksWithHrefs.changes.subscribe((c) => this.update());
        this.update();
    }

    ngOnDestroy() {
        if(this.navigationSubscription)
            this.navigationSubscription.unsubscribe();
    }

    onToggle() {
        this.open = !this.open;
    }

    private update(){
        if(!this.links || !this.linksWithHrefs || !this.router.navigated)
            return;
        this.active = this.hasActiveLinks();

        if(!this.open)
            this.open = this.active;
    }

    private isLinkActive(router: Router): (link: (RouterLink | RouterLinkWithHref)) => boolean {
        return (link: RouterLink | RouterLinkWithHref) =>
            router.isActive(link.urlTree, this.routerLinkActiveOptions.exact);
    }

    private hasActiveLinks(): boolean {
        return this.links.some(this.isLinkActive(this.router)) ||
            this.linksWithHrefs.some(this.isLinkActive(this.router));
    }
}