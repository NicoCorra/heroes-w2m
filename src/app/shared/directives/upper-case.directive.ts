import { Directive, ElementRef, HostListener, input, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: 'appUpperCase]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: UpperCaseDirective,
      multi: true
    }
  ]
})
export class UpperCaseDirective implements ControlValueAccessor {

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
  registerOnChange(fn: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnTouched(fn: any): void {
    this.onTouchEnd = fn;
  }
}
