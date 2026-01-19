import { Directive, ElementRef, HostListener, forwardRef, inject, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
    selector: '[appAmountFormat]',
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AmountFormatDirective),
            multi: true
        }
    ]
})
export class AmountFormatDirective implements ControlValueAccessor {
    public currencyCode = input<string>('USD', { alias: 'appAmountFormat' });
    private el = inject(ElementRef);
    private onChange: (value: number) => void = () => { };
    private onTouched: () => void = () => { };
    private innerValue: number = 0;

    @HostListener('input', ['$event.target'])
    onInput(target: any) {
        if (!target || !(target instanceof HTMLInputElement)) return;
        const value = target.value;
        // Remove all non-numeric characters except the decimal point
        const numericValue = value.replace(/[^0-9.]/g, '');
        const number = parseFloat(numericValue) || 0;
        this.innerValue = number;
        this.onChange(number);
    }

    @HostListener('blur')
    onBlur() {
        this.onTouched();
        this.formatValue();
    }

    @HostListener('focus')
    onFocus() {
        // Show raw number on focus for easier editing
        this.el.nativeElement.value = this.innerValue === 0 ? '' : this.innerValue.toString();
    }

    writeValue(value: number): void {
        this.innerValue = value || 0;
        this.formatValue();
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.el.nativeElement.disabled = isDisabled;
    }

    private formatValue() {
        if (this.innerValue === 0) {
            this.el.nativeElement.value = '';
        } else {
            const locale = this.getLocaleByCurrency(this.currencyCode());
            this.el.nativeElement.value = new Intl.NumberFormat(locale, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }).format(this.innerValue);
        }
    }

    private getLocaleByCurrency(code: string): string {
        const mapping: Record<string, string> = {
            'INR': 'en-IN',
            'USD': 'en-US',
            'EUR': 'de-DE',
            'GBP': 'en-GB',
            'AED': 'ar-AE',
            'SAR': 'ar-SA',
            'PKR': 'en-PK',
            'MYR': 'ms-MY',
            'IDR': 'id-ID',
            'BDT': 'bn-BD'
        };
        return mapping[code] || 'en-US';
    }
}
