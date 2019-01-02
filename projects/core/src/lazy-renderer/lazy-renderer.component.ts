import { Component, ElementRef, ContentChild, TemplateRef, Input } from "@angular/core";
import { NgEzInViewportEvent } from "../in-viewport/models";
import { NgEzLazyRendererConfig } from "./models";

@Component({
    selector: 'ngez-lazy-renderer',
    templateUrl: './lazy-renderer.component.html',
    styleUrls: ['./lazy-renderer.component.scss']
})
export class NgEzLazyRendererComponent {

    @Input() config: NgEzLazyRendererConfig;

    @ContentChild(TemplateRef) template: TemplateRef<any>;

    shouldRender = false;

    onChange(change: NgEzInViewportEvent) {
        if (change.any && !this.shouldRender)
            this.render();
    }

    render() {
        setTimeout(() => this.shouldRender = true, 0);
    }
}