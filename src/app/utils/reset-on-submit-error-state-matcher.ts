import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';

export class ResetOnSubmitErrorStateMatcher implements ErrorStateMatcher {
  constructor(private isSubmitted: () => boolean) {}

  isErrorState(
    control: FormControl | null,
    _form: FormGroupDirective | NgForm | null
  ): boolean {
    return !!(
      control &&
      control.invalid &&
      (control.touched || this.isSubmitted())
    );
  }
}
