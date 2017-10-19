import {AbstractControl, NG_VALIDATORS, Validator} from "@angular/forms";
import {Directive, forwardRef, Input} from "@angular/core";

@Directive({
  selector: '[repeat][ngModel],[repeat][formControl]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: forwardRef(() => RepeatValidator), multi: true}
  ]
})
export class RepeatValidator implements Validator {

  @Input()
  public other: AbstractControl;

  validate(c: AbstractControl): { [key: string]: any; } {
    const valid = c.value === this.other.value;
    if (!valid) {
      return {valid};
    } else {
      return {};
    }
  }


}
