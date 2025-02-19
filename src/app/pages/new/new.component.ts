import { Heroe } from './../../shared/interfaces/heroe';
import { Component, effect, OnInit, signal } from '@angular/core';
import { HeroesService } from '../../shared/services/heroes.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../shared/material/material.module';
import { CommonModule } from '@angular/common';
import { ImageHeroePipe } from '../../shared/pipes/image-heroe.pipe';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { UppercaseDirective } from '../../shared/directives/upper-case.directive';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-new',
  standalone: true,
  imports: [MaterialModule, CommonModule, ImageHeroePipe, RouterLink, UppercaseDirective, FormsModule],
  templateUrl: './new.component.html',
  styleUrl: './new.component.css'
})
export class NewComponent implements OnInit{

  heroeForm = signal<Heroe>({
    id: '',
    superhero: '',
    publisher: '',
    alter_ego: '',
    first_appearance: '',
    alt_img: '',
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ];

  protected heroes: Heroe[] = [];


  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  get currentHeroe(): Heroe {
    return this.heroeForm();
  }

  ngOnInit(): void {

    if ( !this.router.url.includes('edit') ) return;

    this.activatedRoute.params.subscribe(({ id }) => {
      const heroe = this.heroesService.getHeroesById(id)();
      if (!heroe) {
        this.router.navigateByUrl('/');
        return;
      }
      this.heroeForm.set(heroe);
    });
  }

  onSubmit() {
    if (this.router.url.includes('edit')) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          message: `¿Quieres editar el heroe ${this.currentHeroe.superhero}?`
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const updateHeroeSignal = this.heroesService.updateHeroe(this.currentHeroe);

          setTimeout(() => {
            const hero = updateHeroeSignal();
            if (hero) {
              this.showSnackbar(`${hero.superhero} actualizado!`);
            }
            }, 0);
            this.router.navigate(['pages/list']);
        } else {
          this.showSnackbar('Operación cancelada.');
          this.router.navigate(['/pages/list']);
        }
      });
    } else {
      this.currentHeroe.id = this.currentHeroe.alt_img || '';
      const newHeroeSignal = this.heroesService.addHeroe(this.currentHeroe);
      setTimeout(() => {
        const newhero = newHeroeSignal();
        if (newhero) {
          this.showSnackbar(`${this.currentHeroe.superhero} creado!`);
        }
        }, 0);

        this.router.navigate(['pages/list'], { queryParams: { reload: true } });
    }
  }

  showSnackbar( message: string ):void {
    this.snackbar.open( message, 'done', {
      duration: 2500,
    })
  }
}
