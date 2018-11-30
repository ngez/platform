import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [{
    path: '',
    loadChildren: './pages/overview/core-overview.module#CoreOverviewModule'
}];

@NgModule({
    imports: [RouterModule.forChild(routes)]
})
export class CoreRoutingModule{}