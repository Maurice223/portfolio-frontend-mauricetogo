import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Experience } from '../../model/experience';
import { ExperienceService } from '../../services/experience';


@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [],
  templateUrl: './experience.html',
  styleUrl: './experience.css'
})
export class ExperienceComponent implements OnInit {


  experiences: Experience[] = [];


  constructor(
    private experienceService: ExperienceService,
    private cdr: ChangeDetectorRef
  ) { }



  ngOnInit(): void {

    this.chargerExperiences();

  }



  chargerExperiences() {

    this.experienceService
      .getExperiences()
      .subscribe({

        next: (data) => {

          console.log("Expériences reçues :", data);

          this.experiences = data;

          this.cdr.detectChanges();

        },


        error: (err) => {

          console.error(
            "Erreur expériences",
            err
          );

        }

      });

  }


}