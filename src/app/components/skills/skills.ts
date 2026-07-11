import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Competence } from '../../model/competence';
import { CompetenceService } from '../../services/competence';
import AOS from 'aos';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [],
  templateUrl: './skills.html',
  styleUrl: './skills.css'
})

export class SkillsComponent implements OnInit {


  competences:any[] = [];


  constructor(
    private skillService: CompetenceService,
    private cdr: ChangeDetectorRef
  ){}


  ngOnInit(){


    this.skillService.getCompetences()
    .subscribe({

      next:(data)=>{


        console.log("Compétences reçues :", data);


        this.competences = data;


        this.cdr.detectChanges();


      },


      error:(err)=>{

        console.error(err);

      }

    });


  }


}