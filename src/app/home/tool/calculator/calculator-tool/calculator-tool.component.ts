import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';

@Component({
    selector: 'app-calculator-tool',
    imports: [],
    templateUrl: './calculator-tool.component.html',
    styleUrl: './calculator-tool.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculatorToolComponent {
    public isOpen = signal(false);
    public display = signal('0');

    public firstOperand = signal<number | null>(null);
    public operator = signal<string | null>(null);
    private waitForSecondOperand = signal(false);

    toggle() {
        this.isOpen.update(val => !val);
    }

    appendDigit(digit: string) {
        if (this.waitForSecondOperand()) {
            this.display.set(digit);
            this.waitForSecondOperand.set(false);
        } else {
            const current = this.display();
            this.display.set(current === '0' ? digit : current + digit);
        }
    }

    appendDecimal() {
        if (this.waitForSecondOperand()) {
            this.display.set('0.');
            this.waitForSecondOperand.set(false);
            return;
        }
        if (!this.display().includes('.')) {
            this.display.set(this.display() + '.');
        }
    }

    clear() {
        this.display.set('0');
        this.firstOperand.set(null);
        this.operator.set(null);
        this.waitForSecondOperand.set(false);
    }

    setOperator(op: string) {
        const inputValue = parseFloat(this.display());

        if (this.operator() && this.waitForSecondOperand()) {
            this.operator.set(op);
            return;
        }

        if (this.firstOperand() === null) {
            this.firstOperand.set(inputValue);
        } else if (this.operator()) {
            const result = this.calculateOperation(this.firstOperand()!, inputValue, this.operator()!);
            this.display.set(String(result));
            this.firstOperand.set(result);
        }

        this.waitForSecondOperand.set(true);
        this.operator.set(op);
    }

    calculate() {
        const inputValue = parseFloat(this.display());
        const op = this.operator();
        const first = this.firstOperand();

        if (op && first !== null) {
            const result = this.calculateOperation(first, inputValue, op);
            this.display.set(String(result));
            this.firstOperand.set(null);
            this.operator.set(null);
            this.waitForSecondOperand.set(false);
        }
    }

    private calculateOperation(first: number, second: number, op: string): number {
        switch (op) {
            case '+': return first + second;
            case '-': return first - second;
            case '*': return first * second;
            case '/': return second !== 0 ? first / second : 0;
            default: return second;
        }
    }
}
