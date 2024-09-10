import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function maxFileSize(maxSize: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value as File;

    if (file && file.size > maxSize) {
      return { maxSize: { requiredSize: maxSize, actualSize: file.size } };
    }

    return null;
  };
}
