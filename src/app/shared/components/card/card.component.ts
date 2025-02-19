import { ImageHeroePipe } from './../../pipes/image-heroe.pipe';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { RouterLink } from '@angular/router';
import { Heroe } from '../../interfaces/heroe';

@Component({
  selector: 'heroes-heroe-card',
  standalone: true,
  imports: [CommonModule, MaterialModule, ImageHeroePipe, RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {

  public heroe = input.required<Heroe>();
  @Output() deleteHeroe = new EventEmitter<string>();

  ngOnInit(): void {
    if (!this.heroe ) throw new Error('Hero property is required');
  }

  onDeleteHeroe(id: string): void {
    this.deleteHeroe.emit(id);
  }

}
