import { Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, OnInit, ViewChild, viewChild } from '@angular/core';
import { HeroesService } from '../../shared/services/heroes.service';
import { Heroe } from '../../shared/interfaces/heroe';
import { MaterialModule } from '../../shared/material/material.module';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/card/card.component';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { SearchComponent } from '../../shared/components/search/search.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MaterialModule,
    CommonModule,
    CardComponent,
    PaginatorComponent,
    SearchComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class ListComponent implements OnInit {
  @ViewChild(PaginatorComponent) paginator!: PaginatorComponent

  protected heroes: Heroe[] = [];
  protected heroesToShow: Heroe[] = [];
  protected filteredHeroes: Heroe[] = [];
  protected length: number = 0;
  protected pageSize: number = 6;
  protected pageIndex: number = 0;

  constructor(private heroesService: HeroesService,
              private router: Router,
              private snackbar: MatSnackBar,
              private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.heroesService.getHeroes().subscribe(heroes => {
      this.heroes = heroes;
      this.filteredHeroes = heroes
      this.length = this.heroes.length;

      this.updateHeroesToShow();
    });
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.updateHeroesToShow();
  }

  private pageChange(event: any): void {
    this.onPageChange(event);
  }

  private updateHeroesToShow(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.heroesToShow = this.filteredHeroes.slice(startIndex, endIndex);
  }

  onSearchTextChange(searchText: string): void {
    this.filteredHeroes = this.heroesService.searchHeroesByName(this.heroes, searchText)

    this.pageIndex = 0;
    this.length = this.filteredHeroes.length;
    this.updateHeroesToShow();
  }

  goToNew() {
    this.router.navigate(['pages/new']);
  }

  async onDeleteHero(id: string) {
    if (!id) {
      throw Error('Hero id is required');
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `¿Estás seguro de que quieres eliminar al héroe ${id}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.heroesService.deleteHeroe(id)
          .subscribe(wasDeleted => {
            if (wasDeleted) {
              this.heroes = this.heroes.filter(heroe => heroe.id !== id);
              this.filteredHeroes = this.heroes.filter(heroe => heroe.id !== id);

              this.pageIndex = 0;
              this.length = this.filteredHeroes.length;

              if (this.paginator) {
                this.pageChange({ pageIndex: 0, pageSize: this.pageSize });
              }

              this.updateHeroesToShow();
              this.showSnackbar(`${id} ha sido eliminado.`);
              window.location.reload();
            } else {
              this.showSnackbar('Hubo un problema al eliminar el héroe.');
            }
          });
      } else {
        this.showSnackbar('Operación de eliminación cancelada.');
      }
    });
  }

  showSnackbar( message: string ):void {
    this.snackbar.open( message, 'done', {
      duration: 2500,
    })
  }
}
