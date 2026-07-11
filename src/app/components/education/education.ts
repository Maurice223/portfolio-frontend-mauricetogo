import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Formation } from '../../model/formation';
import { FormationService } from '../../services/formation';


@Component({
  selector: 'app-education',
  standalone: true,
  imports: [],
  templateUrl: './education.html',
  styleUrl: './education.css'
})
export class EducationComponent implements OnInit {


  formations: Formation[] = [];


  constructor(
      private formationService: FormationService,
      private cdr: ChangeDetectorRef
    ){}



  ngOnInit(): void {

    this.chargerFormations();

  }



  chargerFormations(){

    this.formationService
    .getFormations()
    .subscribe({

      next:(data)=>{

        this.formations = data;
        this.cdr.detectChanges();

        console.log(
          "Formations reçues :",
          data
        );

      },


      error:(err)=>{

        console.error(
          "Erreur formations",
          err
        );

      }

    });

  }


}