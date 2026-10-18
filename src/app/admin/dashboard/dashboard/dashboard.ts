
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ProjetService } from '../../../services/projet';
import { CompetenceService } from '../../../services/competence';
import { ExperienceService } from '../../../services/experience';
import { FormationService } from '../../../services/formation';
import { MessageContactService } from '../../../services/contact';

interface DashboardMessage {
  id?: number;
  nom?: string;
  email?: string;
  sujet?: string;
  message?: string;
  contenu?: string;
  dateEnvoi?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  projets = 0;
  competences = 0;
  experiences = 0;
  formations = 0;
  nombreMessages = 0;

  messagesRecents: DashboardMessage[] = [];

  loading = true;
  error = '';
  erreursPartielles: string[] = [];

  constructor(
    private projetService: ProjetService,
    private competenceService: CompetenceService,
    private experienceService: ExperienceService,
    private formationService: FormationService,
    private messageService: MessageContactService
  ) {}

  ngOnInit(): void {
    forkJoin({
      projets: this.projetService.getProjets().pipe(
        catchError(() => {
          this.erreursPartielles.push('projets');
          return of([]);
        })
      ),
      competences: this.competenceService.getCompetences().pipe(
        catchError(() => {
          this.erreursPartielles.push('compétences');
          return of([]);
        })
      ),
      experiences: this.experienceService.getExperiences().pipe(
        catchError(() => {
          this.erreursPartielles.push('expériences');
          return of([]);
        })
      ),
      formations: this.formationService.getFormations().pipe(
        catchError(() => {
          this.erreursPartielles.push('formations');
          return of([]);
        })
      ),
      messages: this.messageService.getMessages().pipe(
        catchError(() => {
          this.erreursPartielles.push('messages');
          return of([]);
        })
      )
    }).subscribe({
      next: (data) => {
        this.projets = data.projets.length;
        this.competences = data.competences.length;
        this.experiences = data.experiences.length;
        this.formations = data.formations.length;
        this.nombreMessages = data.messages.length;

        this.messagesRecents = [...data.messages]
          .sort((a, b) => {
            const dateA = new Date(a.dateEnvoi ?? 0).getTime();
            const dateB = new Date(b.dateEnvoi ?? 0).getTime();

            return dateB - dateA;
          })
          .slice(0, 5);

        if (this.erreursPartielles.length > 0) {
          this.error =
            'Certaines données ne sont pas disponibles : ' +
            this.erreursPartielles.join(', ') +
            '. Vérifie les services et les autorisations du backend.';
        }

        this.loading = false;
      },
      error: () => {
        this.error = 'Impossible de charger le tableau de bord.';
        this.loading = false;
      }
    });
  }

  apercuMessage(message: DashboardMessage): string {
    return message.message || message.contenu || 'Aucun contenu disponible';
  }

  initiales(nom?: string): string {
    if (!nom?.trim()) {
      return '?';
    }

    return nom
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(partie => partie.charAt(0).toUpperCase())
      .join('');
  }
}
