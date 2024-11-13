import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export function errorHandler(errorRes: HttpErrorResponse) {
  console.log(errorRes);
  let errorMessage = 'An undefined error occurred!';

  if (errorRes.error) {
    if (errorRes.error.errors) {
      errorMessage =
        errorRes.error.errors.map((err: any) => err.msg).join(', ') ||
        errorRes.error.message;
    } else if (errorRes.error.error) {
      errorMessage = errorRes.error.error;
    } else if (errorRes.error.message) {
      errorMessage = errorRes.error.message;
    }
  }
  // Trả về observable với lỗi được định nghĩa
  return throwError(() => new Error(errorMessage));
}
