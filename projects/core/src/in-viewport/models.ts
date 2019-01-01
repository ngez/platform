export interface NgEzInViewportConfig{
    querySelector?: string;
    offset?: NgEzViewportOffsetConfig
}

interface NgEzViewportOffsetConfig{
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
}

export interface NgEzInViewportEvent{
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
    any: boolean;
    all: boolean;
}

export const defaultConfig: NgEzInViewportConfig = {
    querySelector: null
}

export const defaultOffsetConfig: NgEzViewportOffsetConfig = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
}