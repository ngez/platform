import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [{
    path: '',
    loadChildren: './pages/overview/core-overview.module#CoreOverviewModule'
}, {
    path: 'autocomplete',
    loadChildren: './pages/autocomplete/autocomplete.module#AutocompleteModule'
}, {
    path: 'nested-nav',
    loadChildren: './pages/nested-nav/nested-nav.module#NestedNavModule'
}, {
    path: 'code-prettify',
    loadChildren: './pages/code-prettify/code-prettify.module#CodePrettifyModule'
}, {
    path: 'outside',
    loadChildren: './pages/outside/outside.module#OutsideModule'
}, {
    path: 'clipboard',
    loadChildren: './pages/clipboard/clipboard.module#ClipboardModule'
}, {
    path: 'lazy-renderer',
    loadChildren: './pages/lazy-renderer/lazy-renderer.module#LazyRendererModule'
}, {
    path: 'in-viewport',
    loadChildren: './pages/in-viewport/in-viewport.module#InViewportModule'
}, {
    path: 'file',
    loadChildren: './pages/file-input/file-input.module#FileInputModule'
}];

@NgModule({
    imports: [RouterModule.forChild(routes)]
})
export class CoreRoutingModule{}