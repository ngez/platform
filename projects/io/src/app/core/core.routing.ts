import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [{
    path: '',
    loadChildren: () => import('./pages/overview/core-overview.module').then(m => m.CoreOverviewModule)
}, {
    path: 'autocomplete',
    loadChildren: () => import('./pages/autocomplete/autocomplete.module').then(m => m.AutocompleteModule)
}, {
    path: 'nested-nav',
    loadChildren: () => import('./pages/nested-nav/nested-nav.module').then(m => m.NestedNavModule)
}, {
    path: 'code-prettify',
    loadChildren: () => import('./pages/code-prettify/code-prettify.module').then(m => m.CodePrettifyModule)
}, {
    path: 'outside-click',
    loadChildren: () => import('./pages/outside-click/outside-click.module').then(m => m.OutsideClickModule)
}, {
    path: 'clipboard',
    loadChildren: () => import('./pages/clipboard/clipboard.module').then(m => m.ClipboardModule)
}, {
    path: 'lazy-renderer',
    loadChildren: () => import('./pages/lazy-renderer/lazy-renderer.module').then(m => m.LazyRendererModule)
}, {
    path: 'in-viewport',
    loadChildren: () => import('./pages/in-viewport/in-viewport.module').then(m => m.InViewportModule)
}, {
    path: 'file-input',
    loadChildren: () => import('./pages/file-input/file-input.module').then(m => m.FileInputModule)
}, {
    path: 'forms',
    loadChildren: () => import('./pages/forms/forms.module').then(m => m.FormsModule)
}, {
    path: 'file-dropzone',
    loadChildren: () => import('./pages/file-dropzone/file-dropzone.module').then(m => m.FileDropzoneModule)
}];

@NgModule({
    imports: [RouterModule.forChild(routes)]
})
export class CoreRoutingModule{}