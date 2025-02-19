import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { PaginatorIntlService } from './shared/services/paginator-intl.service';
import { ErroResponseInterceptor } from './shared/error-response.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(
      withFetch(),
      withInterceptors([ErroResponseInterceptor])),
    PaginatorIntlService,
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: ErroResponseInterceptor,
      multi: true,
    }, provideAnimationsAsync(),
  ]
};

