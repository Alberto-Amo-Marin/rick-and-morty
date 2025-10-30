import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of, switchMap, map } from 'rxjs';
import { RickMortyService } from './services/rick-morty.service';
import type { Character, Status, Filters } from './core/models/character/character';
import type { CharacterCard } from './core/models/character/card';
import { FiltersComponent } from './components/filters/filters.component';
import { CharacterCardsComponent } from './components/character-cards/character-cards.component';

type Card = {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
  locationName: string;
  firstSeen: string;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, FiltersComponent, CharacterCardsComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  loading = signal(true);
  cards = signal<CharacterCard[]>([]);

  statusOpts = ['alive', 'dead', 'unknown'];
  genderOpts = ['female', 'male', 'genderless', 'unknown'];

  statusFilter: Filters['status'] = null;
  genderFilter: Filters['gender'] = null;

  constructor(private api: RickMortyService) {
    try {
      const saved = JSON.parse(localStorage.getItem('rnm_filters') || '{}');
      this.statusFilter = saved?.status ?? null;
      this.genderFilter = saved?.gender ?? null;
    } catch {}
    this.load();
  }

  onFiltersChange(f: Filters) {
    this.statusFilter = f.status ?? null;
    this.genderFilter = f.gender ?? null;
    localStorage.setItem('rnm_filters', JSON.stringify({ status: this.statusFilter, gender: this.genderFilter }));
    this.load();
  }

  private load() {
    this.loading.set(true);

    const filters: Filters = {
      status: this.statusFilter || null,
      gender: this.genderFilter || null
    };

    this.api
      .getFiveCharacters(filters)
      .pipe(
        switchMap((chars: Character[]) => {
          const urls = (chars || []).map((c) => c.episode?.[0]).filter(Boolean) as string[];
          const ep$ = urls.length
            ? forkJoin(urls.map((u) => this.api.getEpisodeName(u)))
            : of([] as string[]);
          return ep$.pipe(map((epNames) => ({ chars, epNames })));
        }),
        map(({ chars, epNames }) =>
          (chars || []).map(
            (c, i): CharacterCard => ({
              id: c.id,
              name: c.name,
              status: c.status,
              species: c.species,
              image: c.image,
              locationName: c.location?.name ?? 'N/A',
              firstSeen: epNames[i] ?? 'N/A'
            })
          )
        )
      )
      .subscribe({
        next: (cards) => {
          this.cards.set(cards);
          this.loading.set(false);
        },
        error: () => {
          this.cards.set([]);
          this.loading.set(false);
        }
      });
  }

  statusColor(s: Status | string) {
    const v = (s || '').toString().toLowerCase();
    if (v === 'alive') return '#22c55e';
    if (v === 'dead') return '#ef4444';
    return '#9ca3af';
  }
}


