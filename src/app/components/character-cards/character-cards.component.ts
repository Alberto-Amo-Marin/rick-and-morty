import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import type { CharacterCard } from '../../core/models/character/card';

@Component({
  selector: 'app-character-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-cards.component.html',
  styleUrl: './character-cards.component.scss'
})
export class CharacterCardsComponent {
  @Input() cards: CharacterCard[] = [];

  statusColor(s: string) {
    const v = (s || '').toLowerCase();
    if (v === 'alive') return '#22c55e';
    if (v === 'dead') return '#ef4444';
    return '#9ca3af';
  }
}

