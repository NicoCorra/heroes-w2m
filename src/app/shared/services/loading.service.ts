import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  hideLoading(): void {
    this.loadingSubject.next(false);
  }
  showLoading(): void {
    this.loadingSubject.next(true);
  }
}
