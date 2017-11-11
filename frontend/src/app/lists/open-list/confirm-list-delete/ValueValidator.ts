import {Directive, forwardRef, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';


@Directive({
  selector: '[valueMatch][ngModel],[valueMatch][formControl]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: forwardRef(() => ValueMatchValidator), multi: true},
  ],
})
export class ValueMatchValidator implements Validator {
  @Input()
  public match: any;

  validate(c: AbstractControl): { [key: string]: any; } {
    console.log(this, c.value);
    return c.value === this.match ? {} : {valueMatch: true};
  }


}
