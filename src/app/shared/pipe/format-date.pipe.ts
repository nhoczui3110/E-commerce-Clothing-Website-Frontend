import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';

    // Convert value to Date if it's not already a Date object
    const date = new Date(value);

    // Định dạng theo kiểu ngày/tháng/năm giờ:phút:giây
    return date.toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh', // Điều chỉnh múi giờ tùy theo yêu cầu
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
}
