export interface NgEzCodePrettifyOptions{
    header?: string;
    code?: string;
    path?: string;
    language?: string
    theme?: string;
    linenums?: boolean | number;
    canCopy?: boolean;
    maxHeight?: number;
}