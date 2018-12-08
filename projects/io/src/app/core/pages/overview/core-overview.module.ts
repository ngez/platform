import { NgModule } from "@angular/core";
import { CoreOverviewPage } from "./core-overview.page";
import { Routes, RouterModule } from '@angular/router';
import { NgEzCodePrettifyModule } from '@ngez/core';
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const routes: Routes = [{
    path: '',
    component: CoreOverviewPage
}];

@NgModule({
    imports: [
        FlexLayoutModule,
        MatProgressSpinnerModule,
        RouterModule.forChild(routes),
        NgEzCodePrettifyModule,
        CommonModule
    ],
    declarations: [CoreOverviewPage]
})
export class CoreOverviewModule{}