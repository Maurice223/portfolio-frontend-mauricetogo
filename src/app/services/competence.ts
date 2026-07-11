import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Competence } from '../model/competence';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CompetenceService {


  private apiUrl = `${environment.apiUrl}/competences`;


  constructor(
    private http: HttpClient
  ) {}



  getCompetences(): Observable<Competence[]> {

    return this.http.get<Competence[]>(this.apiUrl);

  }


}