import { NgModule } from "@angular/core";
import { CoreOverviewPage } from "./core-overview.page";
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
    path: '',
    component: CoreOverviewPage
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    declarations: [CoreOverviewPage]
})
export class CoreOverviewModule{}