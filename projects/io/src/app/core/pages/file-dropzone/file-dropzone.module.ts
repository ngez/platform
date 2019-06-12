import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule, Routes } from '@angular/router';
import { NgEzFileModule } from 'projects/core/src/file';
import { NgEzCodePrettifyModule } from 'projects/core/src/public_api';

import { FileDropzonePage } from './file-dropzone.page';

// import { NgEzCodePrettifyModule, NgEzFileModule } from '@ngez/core';
const routes: Routes = [
  {
    path: "",
    component: FileDropzonePage
  }
];

@NgModule({
  imports: [
    NgEzCodePrettifyModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
    RouterModule.forChild(routes),
    CommonModule,
    NgEzFileModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  declarations: [FileDropzonePage]
})
export class FileDropzoneModule {}
