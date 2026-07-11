import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Formation } from '../model/formation';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FormationService {


  private apiUrl = `${environment.apiUrl}/formations`;


  constructor(
    private http: HttpClient
  ) {}



  getFormations(): Observable<Formation[]> {

    return this.http.get<Formation[]>(this.apiUrl);

  }


}