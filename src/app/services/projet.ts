import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Projet } from '../model/projet';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProjetService {


  private apiUrl = 'http://localhost:8080/api/projets';


  constructor(
    private http: HttpClient
  ) {}


   // Récupérer tous les projets

  getProjets(){

    return this.http.get<any[]>(this.apiUrl);

  }



  // Ajouter un projet

  ajouterProjet(projet:any){

    return this.http.post(
      this.apiUrl,
      projet
    );

  }



  // Modifier un projet

  modifierProjet(id:number, projet:any){

    return this.http.put(
      `${this.apiUrl}/${id}`,
      projet
    );

  }



  // Supprimer un projet

  supprimerProjet(id:number){

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );

  }

}