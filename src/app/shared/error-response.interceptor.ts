import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, finalize, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { LoadingService } from './services/loading.service';

export const ErroResponseInterceptor: HttpInterceptorFn = (req, next) => {

  const loadingService = inject(LoadingService);
  // Mostrar el componente de carga al inicio de la petición
  loadingService.showLoading();

  return next(req).pipe(
    // Capturar el error si ocurre
    catchError(handleErrorResponse),
    // Finalizar la petición y ocultar el componente de carga
    finalize(() => {
      loadingService.hideLoading();
    })
  );
};

function handleErrorResponse(error: HttpErrorResponse) {
  console.error('Mi error: ' + error);
  return throwError(() => error);
}
