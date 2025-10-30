import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';

type Filters = { status?: string | null; gender?: string | null; name?: string | null };

@Injectable({ providedIn: 'root' })
export class RickMortyService {
  constructor(private http: HttpClient) { }

  getFiveCharacters(filters: Filters = {}) {
    let params = new HttpParams();
    if (filters.status) params = params.set('status', filters.status);
    if (filters.gender) params = params.set('gender', filters.gender);
    if (filters.name) params = params.set('name', filters.name);

    return this.http.get<any>('https://rickandmortyapi.com/api/character', { params }).pipe(
      map((r: any) => {
        const list = r?.results ?? [];
        return list.sort(() => Math.random() - 0.5).slice(0, 5);
      })
    );
  }

  getEpisodeName(url: string) {
    return this.http.get<any>(url).pipe(map(e => e?.name ?? '—'));
  }
}
