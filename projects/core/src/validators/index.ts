import { AbstractControl } from "@angular/forms";


// @dynamic
export class NgEzValidators {

    static fileType(accept: string) {
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
                if((/^\./).test(accept))
                    return extensions.push(accept);
                   
                //is a wildcard
                switch(accept){ 
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

        return (control: AbstractControl) => {
            const { value } = control;

            if (!value || !(value instanceof File || value instanceof FileList))
                return null;

            const files = value instanceof FileList
                ? Array.from(value)
                : [value];

            for(let i = 0; i < files.length; i++){
                const file = files[i];
                if(anyImage && this.getMimeTypeRegex(IMAGE_WILDCARD).test(file.type))
                    continue;
                if(anyAudio && this.getMimeTypeRegex(AUDIO_WILDCARD).test(file.type))
                    continue;
                if(anyVideo && this.getMimeTypeRegex(VIDEO_WILDCARD).test(file.type))
                    continue;
                if(mimeTypes.some(type => file.type == type))
                    continue;
                const name = file.name.split('.')
                const fileExtension = name[name.length - 1];
                if(extensions.some(extension => extension.toLowerCase().includes(fileExtension.toLowerCase())))
                    continue;
                return {
                    fileType: {
                        name: file.name,
                        requiredType: accept,
                        actualType: file.type,
                        actualExtension: fileExtension
                    }
                };
            }

            return null;
        }
    }

    static fileSize(units: number, multiple?: ByteMultiplesUnion) {
        const decimalSizes = ['kilobyte', 'megabyte', 'gigabyte', 'terabyte', 'petabyte', 'exabyte', 'zettabyte', 'yottabyte'];
        const binarySizes = ['kibibyte', 'mebibyte', 'gibibyte', 'tebibyte', 'pebibyte', 'exbibyte', 'zebibyte', 'yobibyte'];

        return (control: AbstractControl) => {
            const { value } = control;

            if (!value || !(value instanceof File || value instanceof FileList))
                return null;

            const files = value instanceof FileList
                ? Array.from(value)
                : [value];

            if (!multiple)
                return this.everyFileSizeIsValid(units, files);

            {
                const power = decimalSizes.findIndex(decimalSize => decimalSize == multiple) + 1;

                if (power)
                    return this.everyFileSizeIsValid(Math.pow(1000, power) * units, files);
            }

            {
                const power = binarySizes.findIndex(binarySize => binarySize == multiple) + 1;

                if (power)
                    return this.everyFileSizeIsValid(Math.pow(1024, power) * units, files);
            }

            return this.everyFileSizeIsValid(units, files);
        }

    }

    private static everyFileSizeIsValid(bytes: number, files: File[]) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.size > bytes)
                return {
                    fileSize: {
                        name: file.name,
                        requiredSize: bytes,
                        actualSize: file.size
                    }
                };
        }

        return null;
    }

    private static getMimeTypeRegex(str: string, ) {
        return new RegExp(str.replace('*', '.*'), 'i' );
    }

}

type ByteMultiplesUnion = 'kilobyte'
    | 'kibibyte'
    | 'megabyte'
    | 'mebibyte'
    | 'gigabyte'
    | 'gibibyte'
    | 'terabyte'
    | 'tebibyte'
    | 'petabyte'
    | 'pebibyte'
    | 'exabyte'
    | 'exbibyte'
    | 'zettabyte'
    | 'zebibyte'
    | 'yottabyte'
    | 'yobibyte';