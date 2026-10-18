import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProjetService } from '../../services/projet';
import { CommonModule } from '@angular/common';
import AOS from 'aos';


@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class ProjectsComponent implements OnInit {


  projets: any[] = [];


  constructor(
    private projetService: ProjetService,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit() {

    console.log("Début chargement projets");


    this.projetService.getProjets()
      .subscribe({

        next: (data) => {

          console.log("Projets reçus :", data);

          this.projets = data;

          this.cdr.detectChanges();

        },


        error: (err) => {

          console.error("Erreur projets :", err);

        }

      });

  }


}