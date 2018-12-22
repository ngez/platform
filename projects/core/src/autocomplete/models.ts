export const defaultConfig: NgEzAutocompleteConfig = {
    maxHeight: 256
}

export interface NgEzAutocompleteConfig {
    labelExtractor?: (selectedOption: any) => any;
    maxHeight?: number;
}