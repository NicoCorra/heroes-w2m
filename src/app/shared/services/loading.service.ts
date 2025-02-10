import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);  // Controla el estado de la carga
  loading$ = this.loadingSubject.asObservable();  // Observable para otros componentes

  hideLoading(): void {
    this.loadingSubject.next(false);
  }
  showLoading(): void {
    this.loadingSubject.next(true);  // Actualiza el estado a "cargando"
  }
}
