import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Experience } from '../model/experience';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ExperienceService {


  private apiUrl = `${environment.apiUrl}/experiences`;


  constructor(
    private http: HttpClient
  ) {}



  getExperiences(): Observable<Experience[]> {

    return this.http.get<Experience[]>(this.apiUrl);

  }

}