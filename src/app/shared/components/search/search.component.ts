import { Component, EventEmitter, Output } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'heroe-search',
  standalone: true,
  imports: [MaterialModule, CommonModule,ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  @Output() searchText = new EventEmitter<string>();

  searchControl = new FormControl('');

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300),
            distinctUntilChanged())
      .subscribe((value: any) => { this.searchText.emit(value);
      });
  }

}
