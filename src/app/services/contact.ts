
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Message } from '../model/message-contact';

export interface MessageContact {
  nom: string;
  email: string;
  sujet: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageContactService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/messages`;
  

  ajouter(message: MessageContact): Observable<unknown> {
    return this.http.post<unknown>(this.apiUrl, message);
  }

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(this.apiUrl);
  }

  getMessage(id: number): Observable<Message> {
    return this.http.get<Message>(`${this.apiUrl}/${id}`);
  }

  supprimerMessage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}