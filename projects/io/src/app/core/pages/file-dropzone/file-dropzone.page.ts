import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { NgEzCodePrettifyConfig, NgEzFileDropzoneDirective, NgEzFileDropzoneEvent } from '@ngez/core';

@Component({
  selector: "file-dropzone",
  templateUrl: "./file-dropzone.page.html",
  styleUrls: ["./file-dropzone.page.scss"]
})
export class FileDropzonePage {
  @ViewChild(FormGroupDirective) ngForm: FormGroupDirective;

  @ViewChild(NgEzFileDropzoneDirective) dropzone: NgEzFileDropzoneDirective;

  form: FormGroup;

  code1: NgEzCodePrettifyConfig = {
    language: "html",
    path: "assets/code-snippets/core/file-dropzone/app.component.html",
    theme: "dark",
    canCopy: true,
    header: "app.component.html"
  };

  code2: NgEzCodePrettifyConfig = {
    language: "typescript",
    path: "assets/code-snippets/core/file-dropzone/app.component.scss",
    theme: "dark",
    canCopy: true,
    header: "app.component.scss"
  };

  code3: NgEzCodePrettifyConfig = {
    language: "typescript",
    path: "assets/code-snippets/core/file-dropzone/app.component.ts",
    theme: "dark",
    canCopy: true,
    header: "app.component.ts"
  };

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      files: []
    });
  }

  onRemove(file: File) {
    const control = this.form.get("files");
    control.setValue((control.value as File[]).filter(f => file != f));
  }

  onBrowse() {
    this.dropzone.browse();
  }

  onSelected(selection: NgEzFileDropzoneEvent) {
    console.log(selection);
  }

  onReset() {
    this.ngForm.resetForm();
  }
}
