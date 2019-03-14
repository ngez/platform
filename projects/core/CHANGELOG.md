# 4.0.0 (2019-01-29)
### Breaking Changes
* **file-dropzone:** added "multiple" @input which determines whether the control's value will be File[] or simply File.
# 3.0.0 (2019-01-29)
### Bug Fixes
* **file-dropzone:** events fired on child elements no longer remove "active" class.

### Breaking Changes
* **forms:** maxSize and fileType validators now return ValidationError if the value is a File, and ValidationError[] if the value is a FileList or File[].

# 2.0.0 (2019-01-26)
### Features
* Added **file-dropzone** directive.
### Breaking Changes
* **NgEzOutsideDirective** renamed to **NgEzOutsideClickDirective**.
* **NgEzOutsideModule** renamed to **NgEzOutsideClickModule**.

# 1.2.0 (2019-01-11)
### Features
* Added **file-input** directive.
* **forms**: added equals, url, fileType, maxSize and totalSize validators.

# 1.1.0 (2019-01-02)
### Features
* Added **lazy-renderer** component.
* Added **in-viewport** directive.

# 1.0.2 (2018-12-28)
### Bug Fixes
* **code-prettify:** should not throw warning on init.
### Features
* **autocomplete:** cursor changes to "not-allowed" on hover if option is disabled.