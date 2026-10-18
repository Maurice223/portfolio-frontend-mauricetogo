
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { Experience } from '../../../model/experience';
import { ExperienceService } from '../../../services/experience';

@Component({
  selector: 'app-admin-experiences',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './experiences.html',
  styleUrl: './experiences.css'
})
export class AdminExperiencesComponent implements OnInit {
  experiences: Experience[] = [];

  formulaire: Experience = this.formulaireVide();

  recherche = '';
  chargement = false;
  sauvegarde = false;
  formulaireVisible = false;
  modification = false;
  experienceId?: number;

  messageSucces = '';
  messageErreur = '';

  constructor(private experienceService: ExperienceService) {}

  ngOnInit(): void {
    this.chargerExperiences();
  }

  formulaireVide(): Experience {
    return {
      poste: '',
      entreprise: '',
      description: '',
      dateDebut: '',
      dateFin: '',
      technologies: ''
    };
  }

  get experiencesFiltrees(): Experience[] {
    const terme = this.recherche.trim().toLowerCase();

    if (!terme) {
      return this.experiences;
    }

    return this.experiences.filter((experience) =>
      [
        experience.poste,
        experience.entreprise,
        experience.description,
        experience.technologies
      ].some((valeur) => valeur?.toLowerCase().includes(terme))
    );
  }

  get totalExperiences(): number {
    return this.experiences.length;
  }

  chargerExperiences(): void {
    this.chargement = true;
    this.messageErreur = '';

    this.experienceService.getExperiences()
      .pipe(finalize(() => this.chargement = false))
      .subscribe({
        next: (data) => {
          this.experiences = [...data].sort((a, b) =>
            (b.dateDebut || '').localeCompare(a.dateDebut || '')
          );
        },
        error: (error) => {
          console.error('Erreur de chargement des expériences :', error);
          this.messageErreur =
            'Impossible de charger les expériences. Vérifie que le backend est démarré.';
        }
      });
  }

  ouvrirAjout(): void {
    this.formulaire = this.formulaireVide();
    this.experienceId = undefined;
    this.modification = false;
    this.formulaireVisible = true;
    this.messageErreur = '';
    this.messageSucces = '';
  }

  ouvrirModification(experience: Experience): void {
    this.formulaire = {
      ...experience,
      dateFin: experience.dateFin || '',
      technologies: experience.technologies || ''
    };

    this.experienceId = experience.id;
    this.modification = true;
    this.formulaireVisible = true;
    this.messageErreur = '';
    this.messageSucces = '';
  }

  fermerFormulaire(): void {
    if (this.sauvegarde) {
      return;
    }

    this.formulaireVisible = false;
    this.formulaire = this.formulaireVide();
    this.experienceId = undefined;
  }

  enregistrer(): void {
    this.messageErreur = '';
    this.messageSucces = '';

    if (
      !this.formulaire.poste.trim() ||
      !this.formulaire.entreprise.trim() ||
      !this.formulaire.description.trim() ||
      !this.formulaire.dateDebut
    ) {
      this.messageErreur =
        'Remplis le poste, l’entreprise, la description et la date de début.';
      return;
    }

    if (
      this.formulaire.dateFin &&
      this.formulaire.dateFin < this.formulaire.dateDebut
    ) {
      this.messageErreur =
        'La date de fin ne peut pas être antérieure à la date de début.';
      return;
    }

    const donnees: Experience = {
      ...this.formulaire,
      poste: this.formulaire.poste.trim(),
      entreprise: this.formulaire.entreprise.trim(),
      description: this.formulaire.description.trim(),
      technologies: (this.formulaire.technologies || '').trim(),
      dateFin: this.formulaire.dateFin || null
    };

    this.sauvegarde = true;

    const requete = this.modification && this.experienceId !== undefined
      ? this.experienceService.modifierExperience(
          this.experienceId,
          donnees
        )
      : this.experienceService.ajouterExperience(donnees);

    requete
      .pipe(finalize(() => this.sauvegarde = false))
      .subscribe({
        next: () => {
          this.formulaireVisible = false;
          this.messageSucces = this.modification
            ? 'Expérience modifiée avec succès.'
            : 'Expérience ajoutée avec succès.';

          this.formulaire = this.formulaireVide();
          this.experienceId = undefined;
          this.chargerExperiences();
        },
        error: (error) => {
          console.error('Erreur lors de l’enregistrement :', error);
          this.messageErreur =
            error?.error?.message ||
            'Échec de l’enregistrement. Vérifie la connexion au serveur.';
        }
      });
  }

  supprimerExperience(experience: Experience): void {
    if (experience.id === undefined) {
      return;
    }

    const confirmer = window.confirm(
      `Supprimer l’expérience « ${experience.poste} » chez ${experience.entreprise} ?`
    );

    if (!confirmer) {
      return;
    }

    this.messageErreur = '';
    this.messageSucces = '';

    this.experienceService.supprimerExperience(experience.id).subscribe({
      next: () => {
        this.experiences = this.experiences.filter(
          (item) => item.id !== experience.id
        );
        this.messageSucces = 'Expérience supprimée avec succès.';
      },
      error: (error) => {
        console.error('Erreur de suppression :', error);
        this.messageErreur =
          'Impossible de supprimer cette expérience.';
      }
    });
  }

  afficherPeriode(experience: Experience): string {
    const debut = this.formaterDate(experience.dateDebut);
    const fin = experience.dateFin
      ? this.formaterDate(experience.dateFin)
      : "Aujourd’hui";

    return `${debut} — ${fin}`;
  }

  formaterDate(date: string): string {
    if (!date) {
      return '';
    }

    const [annee, mois, jour] = date.split('-').map(Number);

    if (!annee || !mois || !jour) {
      return date;
    }

    return new Intl.DateTimeFormat('fr-FR', {
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC'
    }).format(new Date(Date.UTC(annee, mois - 1, jour)));
  }

  suivreExperience(index: number): number {
    return index;
  }
}
