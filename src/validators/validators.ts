import { FormControl } from '@angular/forms';
export class validators {
    static nameValid(control: FormControl) {
        const regexname = /^[a-zA-Z ,.'-]+$/.test(control.value);
        if (regexname)
            return null;
        return { "invalidName": true };

    }
    static phoneValidator(control: FormControl) {
        const regexphone = /^((\+972|972)|0)( |-)?([1-468-9]( |-)?\d{7}|(5|7)[0-9]( |-)?\d{7})$/.test(control.value);
        if (regexphone)
            return null;
        return { 'invalidPhone': true };
    }
}

