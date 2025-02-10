import { Directive, ElementRef, HostListener, input, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appUppercase]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: UppercaseDirective,
      multi: true
    }
  ]
})
export class UppercaseDirective implements ControlValueAccessor {

  @Input() value: string = '';

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    inputElement.value = inputElement.value.toUpperCase();
    this.onChange(inputElement.value);
  }

  onChange = (value: string) => {};
  onTouchEnd = () => {};

  writeValue(value: string): void {
    this.value = value;
    if (this.el.nativeElement) {
      this.el.nativeElement.value = value?.toUpperCase();
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchEnd = fn;
  }
}
