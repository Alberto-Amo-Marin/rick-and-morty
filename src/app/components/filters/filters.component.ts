import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { Filters } from '../../core/models/character/character';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss'
})
export class FiltersComponent {
  @Input() status: Filters['status'] = null;
  @Input() gender: Filters['gender'] = null;
  @Input() statusOpts: ReadonlyArray<string> = [];
  @Input() genderOpts: ReadonlyArray<string> = [];

  @Output() filtersChange = new EventEmitter<Filters>();

  onChange() {
    this.filtersChange.emit({ status: this.status ?? null, gender: this.gender ?? null });
  }
}
