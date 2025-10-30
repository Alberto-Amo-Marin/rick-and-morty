import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import type { Character, CharacterResponse, Filters } from '../core/models/character/character';

const API_BASE = 'https://rickandmortyapi.com/api';

@Injectable({ providedIn: 'root' })
export class RickMortyService {
  constructor(private http: HttpClient) {}

  getFiveCharacters(filters: Filters = {}): Observable<Character[]> {
    let params = new HttpParams();
    if (filters.status) params = params.set('status', filters.status);
    if (filters.gender) params = params.set('gender', filters.gender);
    if (filters.name) params = params.set('name', filters.name);

    return this.http
      .get<CharacterResponse>(`${API_BASE}/character`, { params })
      .pipe(
        map((r) => {
          const list = r?.results ?? [];
          return list.sort(() => Math.random() - 0.5).slice(0, 5);
        })
      );
  }

  getEpisodeName(url: string): Observable<string> {
    return this.http.get<{ name?: string }>(url).pipe(map((e) => e?.name ?? 'N/A'));
  }
}

