import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, EMPTY, map, Observable, of } from 'rxjs';
import { Heroe } from '../interfaces/heroe';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private baseUrl: string = environment.baseUrl;

  constructor() { }

  http = inject(HttpClient);

  getHeroes(): Observable<Heroe[]> {
    return this.http.get<Heroe[]>(`${ this.baseUrl }/heroes`);
  }

  getHeroesById(id: string): Observable<Heroe | undefined> {
    return this.http.get<Heroe>(`${ this.baseUrl }/heroes/${ id }`).pipe(
      catchError(error => {
        return of(undefined);
      })
    )
  }

  addHeroe( Heroe: Heroe ): Observable<Heroe> {
    return this.http.post<Heroe>(`${ this.baseUrl }/heroes`, Heroe );
  }

  searchHeroesByName(heroes: Heroe[], name: string): Heroe[] {
    if (!name.trim() || name.length < 3) {
      return [...heroes];
    }

    return heroes.filter(heroe =>
      heroe.superhero.toLowerCase().includes(name.toLowerCase()));
  }

  updateHeroe(heroe: Heroe): Observable<Heroe> {
    const url = `${this.baseUrl}/heroes/${heroe.id}`;
    return this.http.put<Heroe>(url,heroe)
  }

  deleteHeroe(id: string): Observable<boolean> {
    return this.http.delete(`${this.baseUrl}/heroes/${id}`).pipe(
      map(() => true),
      catchError((error) => {
        console.error(`Error al eliminar el héroe con ID ${id}:`, error);
        return of(false);
      })
    );
  }
}


