import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ExperienceItem {
  id: number;
  categoria: string;
  ranking: number;
  resenas: number;
  titulo: string;
  descripcion: string;
  horas: number;
  costo: number;
  imagen: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExperienceService {
  private http = inject(HttpClient);
  private apiUrl = '/api/experiencias';

  getExperiences(): Observable<ExperienceItem[]> {
    return this.http.get<ExperienceItem[]>(this.apiUrl);
  }

  getTopExperiences(limit: number = 3): Observable<ExperienceItem[]> {
    return this.getExperiences().pipe(
      map(experiences => 
        [...experiences].sort((a, b) => b.ranking - a.ranking).slice(0, limit)
      )
    );
  }

  createExperience(experience: ExperienceItem): Observable<ExperienceItem> {
    return this.http.post<ExperienceItem>(this.apiUrl, experience);
  }

  updateExperience(id: number, experience: ExperienceItem): Observable<ExperienceItem> {
    return this.http.put<ExperienceItem>(`${this.apiUrl}/${id}`, experience);
  }

  deleteExperience(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
