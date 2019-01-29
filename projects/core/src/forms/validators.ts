import { AbstractControl, FormGroup } from "@angular/forms";

// @dynamic
export class NgEzValidators {

    static equals(c1: string | string[], c2: string | string[]) {
        return (control: FormGroup) => {
            const { value } = control;

            if (!value || !(control instanceof FormGroup))
                return null;

            const formControl1 = control.get(c1);
            const formControl2 = control.get(c2);

            if (!formControl1 || !formControl2)
                return null;

            return formControl1.value == formControl2.value
                ? null
                : {
                    equals: true
                };
        }
    }

    static url(control: AbstractControl) {
        if (!control.value)
            return null;

        const urlRegex = new RegExp(
            "^" +
            // protocol identifier (optional)
            // short syntax // still required
            "(?:(?:(?:https?|ftp):)?\\/\\/)" +
            // user:pass BasicAuth (optional)
            "(?:\\S+(?::\\S*)?@)?" +
            "(?:" +
            // IP address exclusion
            // private & local networks
            "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
            "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
            "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
            // IP address dotted notation octets
            // excludes loopback network 0.0.0.0
            // excludes reserved space >= 224.0.0.0
            // excludes network & broacast addresses
            // (first & last IP address of each class)
            "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
            "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
            "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
            "|" +
            // host & domain names, may end with dot
            // can be replaced by a shortest alternative
            // (?![-_])(?:[-\\w\\u00a1-\\uffff]{0,63}[^-_]\\.)+
            "(?:" +
            "(?:" +
            "[a-z0-9\\u00a1-\\uffff]" +
            "[a-z0-9\\u00a1-\\uffff_-]{0,62}" +
            ")?" +
            "[a-z0-9\\u00a1-\\uffff]\\." +
            ")+" +
            // TLD identifier name, may end with dot
            "(?:[a-z\\u00a1-\\uffff]{2,}\\.?)" +
            ")" +
            // port number (optional)
            "(?::\\d{2,5})?" +
            // resource path (optional)
            "(?:[/?#]\\S*)?" +
            "$", "i"
        );

        return urlRegex.test(control.value) ? null : { url: true };
    }

    static fileType(accept: string) {

        if(!accept)
            return (control: AbstractControl) => null;

        const AUDIO_WILDCARD = 'audio/*';
        const VIDEO_WILDCARD = 'video/*';
        const IMAGE_WILDCARD = 'image/*';
        const extensions: string[] = [];
        const mimeTypes: string[] = [];
        let anyAudio = false;
        let anyVideo = false;
        let anyImage = false;

        accept.split(',')
            .map(accept => accept.trim())
            .filter(accept => accept)
            .forEach(accept => {
                //is an extension
                if ((/^\./).test(accept))
                    return extensions.push(accept);

                //is a wildcard
                switch (accept) {
                    case AUDIO_WILDCARD:
                        return anyAudio = true;
                    case VIDEO_WILDCARD:
                        return anyVideo = true;
                    case IMAGE_WILDCARD:
                        return anyImage = true;
                }

                //anything else is a mime-type
                return mimeTypes.push(accept);
            });

        const validate = (file: File) => {
            if (
                anyImage && this.getMimeTypeRegex(IMAGE_WILDCARD).test(file.type) ||
                anyAudio && this.getMimeTypeRegex(AUDIO_WILDCARD).test(file.type) ||
                anyVideo && this.getMimeTypeRegex(VIDEO_WILDCARD).test(file.type) ||
                mimeTypes.some(type => file.type == type))
                return null;

            const name = file.name.split('.')
            const fileExtension = name[name.length - 1];

            if (extensions.some(extension => extension.toLowerCase().includes(fileExtension.toLowerCase())))
                return null;
            
            return {
                accept,
                actualFile: file
            };
        }

        return (control: AbstractControl) => {
            const { value } = control;

            if (!value || !(value instanceof File || (Array.isArray(value) && value.every(value => value instanceof File)) || value instanceof FileList))
                return null;

            if(value instanceof File)
                return validate(value);
            
            const files: File[] = value instanceof FileList ? Array.from(value) : value;

            const errors = files.map(file => validate(file)).filter(file => file);

            return errors.length ? errors : null;
        }
    }

    static maxSize(bytes: number) {

        const validate = (file: File) => {
            return file.size > bytes 
                ? { requiredSize: bytes, actualFile: file }
                : null; 
        };

        return (control: AbstractControl) => {
            const { value } = control;

            if (!value || !bytes || !(value instanceof File || (Array.isArray(value) && value.every(value => value instanceof File)) || value instanceof FileList))
                return null;

            if(value instanceof File)
                return validate(value);

            const files = value instanceof FileList ? Array.from(value) : value;

            const errors = files.map(file => validate(file)).filter(file => file);

            return errors.length ? errors : null;
        }
    }

    static totalSize(bytes: number) {
        return (control: AbstractControl) => {
            const { value } = control;

            if (!value || !bytes || !(value instanceof File || (Array.isArray(value) && value.every(value => value instanceof File)) || value instanceof FileList))
                return null;

            const files: File[] = value instanceof FileList
                ? Array.from(value)
                : Array.isArray(value)
                    ? value
                    : [value];

            const totalBytes = files.reduce((total, file) => total + file.size, 0);

            return totalBytes <= bytes
                ? null
                : {
                    totalSize: {
                        requiredTotal: bytes,
                        actualTotal: totalBytes
                    }
                };
        }
    }

    private static getMimeTypeRegex(str: string, ) {
        return new RegExp(str.replace('*', '.*'), 'i');
    }

}