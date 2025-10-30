export type Status = 'Alive'|'Dead'|'unknown';
export type Gender = 'Female'|'Male'|'Genderless'|'unknown';

export interface Character {
  id: number;
  name: string;
  status: Status;
  species: string;
  gender: Gender;
  image: string;
  origin?: { name: string };
  location?: { name: string };
}

export interface ApiInfo { count: number; pages: number; next: string|null; prev: string|null; }
export interface CharacterResponse { info: ApiInfo; results: Character[]; }

export interface Filters {
  name?: string|null;
  status?: 'alive'|'dead'|'unknown'|null;
  gender?: 'female'|'male'|'genderless'|'unknown'|null;
}
