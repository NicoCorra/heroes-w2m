import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, finalize, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { LoadingService } from './services/loading.service';

export const ErroResponseInterceptor: HttpInterceptorFn = (req, next) => {

  const loadingService = inject(LoadingService);
  loadingService.showLoading();

  return next(req).pipe(
    catchError(handleErrorResponse),
    finalize(() => {
      loadingService.hideLoading();
    })
  );
};

function handleErrorResponse(error: HttpErrorResponse) {
  console.error('Mi error: ' + error);
  return throwError(() => error);
}
