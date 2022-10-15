import { AbstractControl, ValidatorFn } from "@angular/forms";

export class RegisterValidators {

    static match(controlName: string, MatchName: string): ValidatorFn {
       return (group: AbstractControl) => {
        const control = group.get(controlName);
        const matchingControl = group.get(MatchName);

        if(!control || !matchingControl) {
            return {
                controlNotFound: false
            }
        }
        const error = control.value === matchingControl.value ? null : {noMatch: true}

        matchingControl.setErrors(error)

        return error;
       }
       
    }
}
