import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { RickMortyService } from './services/rick-morty';
import { FormsModule } from '@angular/forms';


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
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  loading = signal(true);
  cards = signal<Card[]>([]);

  status = signal<string | null>(null);
  gender = signal<string | null>(null);

  statusOpts = ['alive', 'dead', 'unknown'];
  genderOpts = ['female', 'male', 'genderless', 'unknown'];

  statusFilter: string | null = null;
  genderFilter: string | null = null;

  constructor(private api: RickMortyService) {
    try {
      const saved = JSON.parse(localStorage.getItem('rnm_filters') || '{}');
      this.statusFilter = saved?.status ?? null;
      this.genderFilter = saved?.gender ?? null;
    } catch { }
    this.load();
  }
  // this.api.getFiveCharacters().subscribe({
  //   next: chars => {
  //     const epCalls = chars.map((c: any) => this.api.getEpisodeName(c.episode?.[0]));
  //     forkJoin<string[]>(epCalls).subscribe({
  //       next: (epNames) => {
  //         const mapped: Card[] = chars.map((c: any, i: number) => ({
  //           id: c.id,
  //           name: c.name,
  //           status: c.status,
  //           species: c.species,
  //           image: c.image,
  //           locationName: c.location?.name ?? '—',
  //           firstSeen: epNames[i] ?? '—'
  //         }));
  //         this.cards.set(mapped);
  //         this.loading.set(false);
  //       },
  //       error: () => this.loading.set(false)
  //     });
  //   },
  //   error: () => this.loading.set(false)
  // });


  onFilterChange() {
    localStorage.setItem('rnm_filters', JSON.stringify({
      status: this.statusFilter || null,
      gender: this.genderFilter || null
    }));
    this.load();
  }

  private load() {
    this.loading.set(true);

    const filters = {
      status: this.statusFilter || null,
      gender: this.genderFilter || null
    };

    this.api.getFiveCharacters(filters).subscribe({
      next: chars => {
        const epCalls = chars.map((c: any) => this.api.getEpisodeName(c.episode?.[0]));
        forkJoin<string[]>(epCalls).subscribe({
          next: (epNames) => {
            const mapped: Card[] = chars.map((c: any, i: number) => ({
              id: c.id,
              name: c.name,
              status: c.status,
              species: c.species,
              image: c.image,
              locationName: c.location?.name ?? '—',
              firstSeen: epNames[i] ?? '—'
            }));
            this.cards.set(mapped);
            this.loading.set(false);
          },
          error: () => this.loading.set(false)
        });
      },
      error: () => {
        this.cards.set([]);
        this.loading.set(false);
      }
    });
  }

  statusColor(s: string) {
    const v = (s || '').toLowerCase();
    if (v === 'alive') return '#22c55e';
    if (v === 'dead') return '#ef4444';
    return '#9ca3af';
  }
}
