import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Heroe } from '../interfaces/heroe';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);

  heroes = signal<Heroe[]>([]);

  constructor() {}

  getHeroes(): WritableSignal<Heroe[]> {
    this.http.get<Heroe[]>(`${this.baseUrl}/heroes`).subscribe(heroes => {
      this.heroes.set(heroes);
    });
    return this.heroes;
  }

  getHeroesById(id: string) : WritableSignal<Heroe | undefined> {
    const selectHeroe = signal<Heroe | undefined>(undefined);

    if (this.heroes().length === 0){
      this.getHeroes();
    }

    if (this.heroes().length > 0) {
      const heroe = this.heroes().find(h => h.id === id);
      selectHeroe.set(heroe);
    }

    return selectHeroe;
  }

  addHeroe(heroe: Heroe): WritableSignal<Heroe | null> {
    const newHeroe = signal<Heroe | null>(null);

    this.http.post<Heroe>(`${this.baseUrl}/heroes`, heroe)
      .subscribe({
        next: (data) => {
          this.heroes.update(heroes => [...heroes, data]);
          newHeroe.set(data);
        },
        error: (err) => {
          console.error('Error adding heroe:', err);
        }
      });

    return newHeroe;
  }

  searchHeroesByName(heroes: Heroe[], name: string): Heroe[] {
    if (!name.trim() || name.length < 3) {
      return [...heroes];
    }

    return heroes.filter(heroe =>
      heroe.superhero.toLowerCase().includes(name.toLowerCase()));
  }

  updateHeroe(heroe: Heroe): WritableSignal<Heroe | null> {
    const updateHeroe = signal<Heroe | null>(null);


    this.http.put<Heroe>(`${this.baseUrl}/heroes/${heroe.id}`, heroe)
    .subscribe({
      next: (data) => {
        updateHeroe.set(data);
      },
      error: (err) => {
        console.error('Error updating heroe:', err);
      }
    });


    return updateHeroe;
  }

  deleteHeroe(id: string): void {
    this.http.delete(`${this.baseUrl}/heroes/${id}`).subscribe({
      next: () => {
        this.heroes.update(heores => heores.filter(h => h.id !== id));
      },
      error: (err) => console.error(`Error al eliminar el héroe con ID ${id}:`, err)
    });
  }
}


