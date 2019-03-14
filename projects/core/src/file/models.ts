export class NgEzFileDropzoneEvent{
    constructor(public event:NgEzFileDropzoneEventTypes, public value: File | File[]){}
}

export type NgEzFileDropzoneEventTypes = 'drop' | 'select';