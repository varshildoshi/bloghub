
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

export class CustomValidators {
    static passwordContainsNumber(control: AbstractControl): ValidationErrors {
        const regex = /\d/;
        if (regex.test(control.value) && control.value !== null) {
            return null;
        } else {
            return { passwordInvalid: true };
        }
    }

}

export function MustMatchValidators(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ confirmedValidator: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}