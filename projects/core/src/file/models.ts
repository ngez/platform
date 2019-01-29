export class NgEzFileDropzoneEvent{
    constructor(private event:NgEzFileDropzoneEventTypes, private files: File[]){}
}

export type NgEzFileDropzoneEventTypes = 'drop' | 'select';