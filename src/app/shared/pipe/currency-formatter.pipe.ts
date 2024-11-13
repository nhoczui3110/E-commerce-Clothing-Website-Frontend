import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormatter',
})
export class CurrencyFormatterPipe implements PipeTransform {
  transform(value: number | string): string {
    if (value === null || value === undefined) {
      return '';
    }

    // Convert the input to a number
    const numberValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numberValue)) {
      return '';
    }

    // Format the number with a thousands separator
    return (
      numberValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VNĐ'
    );
  }
}
