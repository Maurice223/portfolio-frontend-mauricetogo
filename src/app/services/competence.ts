
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Competence } from '../model/competence';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompetenceService {
  private readonly apiUrl = `${environment.apiUrl}/competences`;

  constructor(private http: HttpClient) {}

  getCompetences(): Observable<Competence[]> {
    return this.http.get<Competence[]>(this.apiUrl);
  }

  getCompetence(id: number): Observable<Competence> {
    return this.http.get<Competence>(`${this.apiUrl}/${id}`);
  }

  ajouterCompetence(competence: Competence): Observable<Competence> {
    return this.http.post<Competence>(this.apiUrl, competence);
  }

  modifierCompetence(
    id: number,
    competence: Competence
  ): Observable<Competence> {
    return this.http.put<Competence>(
      `${this.apiUrl}/${id}`,
      competence
    );
  }

  supprimerCompetence(id: number): Observable<string> {
    return this.http.delete(
      `${this.apiUrl}/${id}`,
      { responseType: 'text' }
    );
  }
}
