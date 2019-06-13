import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [{
    path: '',
    pathMatch: 'full',
    redirectTo: 'core'
}, {
    path: 'core',
    loadChildren: () => import('./core/core.routing').then(m => m.CoreRoutingModule)
}];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule{}