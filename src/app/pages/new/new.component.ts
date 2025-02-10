import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HeroesService } from '../../shared/services/heroes.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Heroe } from '../../shared/interfaces/heroe';
import { switchMap } from 'rxjs';
import { MaterialModule } from '../../shared/material/material.module';
import { CommonModule } from '@angular/common';
import { ImageHeroePipe } from '../../shared/pipes/image-heroe.pipe';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-new',
  standalone: true,
  imports: [MaterialModule, CommonModule, ImageHeroePipe, ReactiveFormsModule, RouterLink],
  templateUrl: './new.component.html',
  styleUrl: './new.component.css'
})
export class NewComponent implements OnInit{
  heroeForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl(''),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    alt_img:new FormControl(''),
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ];


  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  get currentHeroe(): Heroe {
    const hero = this.heroeForm.value as Heroe;
    return hero;
  }

  ngOnInit(): void {

    if ( !this.router.url.includes('edit') ) return;

    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.heroesService.getHeroesById( id ) ),
      ).subscribe( hero => {

        if ( !hero ) {
          return this.router.navigateByUrl('/');
        }

        this.heroeForm.reset( hero );
        return;
      });

  }

  onSubmit(): void {
    if (this.heroeForm.invalid) return;
    if ( this.router.url.includes('edit') ){
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          message: `¿Quieres editar el heroe ${this.currentHeroe.superhero}?`
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.heroesService.updateHeroe( this.currentHeroe )
          .subscribe( hero => {
            this.showSnackbar(`${ hero.superhero } updated!`);
          });
          this.router.navigate(['/pages']);
        } else {
          this.showSnackbar('Operación cancelada.');
          this.router.navigate(['/pages/list']);
        }
      });

    } else {
      this.currentHeroe.id = this.currentHeroe.alt_img || '';
      this.heroesService.addHeroe(this.currentHeroe)
        .subscribe((hero: { superhero: any; }) => {
          this.showSnackbar(`${hero.superhero} creado!`);
          this.router.navigate(['/pages']);
        });
    };
  }


  showSnackbar( message: string ):void {
    this.snackbar.open( message, 'done', {
      duration: 2500,
    })
  }
}
