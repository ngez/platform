export const defaultConfig: NgEzAutocompleteConfig = {
    maxHeight: 256,
    minlength: 0
}

export interface NgEzAutocompleteConfig {
    labelExtractor?: (selectedOption: any) => any;
    minlength?: number;
    maxHeight?: number;
}