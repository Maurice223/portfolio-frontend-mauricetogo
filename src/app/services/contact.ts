import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MessageService {


  private apiUrl = 'http://localhost:8080/api/messages';


  constructor(
    private http: HttpClient
  ) { }



  ajouter(message: any): Observable<any> {

    return this.http.post(
      this.apiUrl,
      message
    );

  }


}