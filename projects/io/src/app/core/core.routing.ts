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
    path: 'outside-click',
    loadChildren: './pages/outside-click/outside-click.module#OutsideClickModule'
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
    path: 'file-input',
    loadChildren: './pages/file-input/file-input.module#FileInputModule'
}, {
    path: 'forms',
    loadChildren: './pages/forms/forms.module#FormsModule'
}, {
    path: 'file-dropzone',
    loadChildren: './pages/file-dropzone/file-dropzone.module#FileDropzoneModule'
}];

@NgModule({
    imports: [RouterModule.forChild(routes)]
})
export class CoreRoutingModule{}