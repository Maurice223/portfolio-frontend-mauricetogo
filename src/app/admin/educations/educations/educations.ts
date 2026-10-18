
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { Formation } from '../../../model/formation';
import { FormationService } from '../../../services/formation';

@Component({
  selector: 'app-educations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './educations.html',
  styleUrl: './educations.css'
})
export class AdminEducationsComponent implements OnInit {
  formations: Formation[] = [];

  formulaire: Formation = this.formulaireVide();

  recherche = '';
  chargement = false;
  sauvegarde = false;
  suppressionId: number | null = null;
  formulaireVisible = false;
  modification = false;
  formationId?: number;

  messageSucces = '';
  messageErreur = '';

  constructor(private formationService: FormationService) {}

  ngOnInit(): void {
    this.chargerFormations();
  }

  formulaireVide(): Formation {
    return {
      titre: '',
      ecole: '',
      niveau: '',
      description: '',
      dateDebut: '',
      dateFin: ''
    };
  }

  get formationsFiltrees(): Formation[] {
    const terme = this.recherche.trim().toLowerCase();

    if (!terme) {
      return this.formations;
    }

    return this.formations.filter((formation) =>
      [
        formation.titre,
        formation.ecole,
        formation.niveau,
        formation.description
      ].some((valeur) => (valeur || '').toLowerCase().includes(terme))
    );
  }

  get totalFormations(): number {
    return this.formations.length;
  }

  get totalEnCours(): number {
    return this.formations.filter((formation) => !formation.dateFin).length;
  }

  get totalEtablissements(): number {
    return new Set(
      this.formations
        .map((formation) => formation.ecole.trim().toLowerCase())
        .filter(Boolean)
    ).size;
  }

  chargerFormations(): void {
    this.chargement = true;
    this.messageErreur = '';

    this.formationService.getFormations()
      .pipe(finalize(() => this.chargement = false))
      .subscribe({
        next: (data) => {
          this.formations = [...data].sort((a, b) =>
            (b.dateDebut || '').localeCompare(a.dateDebut || '')
          );
        },
        error: (error) => {
          console.error('Erreur de chargement des formations :', error);
          this.messageErreur =
            'Impossible de charger les formations. Vérifie que le backend est démarré.';
        }
      });
  }

  ouvrirAjout(): void {
    this.formulaire = this.formulaireVide();
    this.formationId = undefined;
    this.modification = false;
    this.formulaireVisible = true;
    this.messageErreur = '';
    this.messageSucces = '';
  }

  ouvrirModification(formation: Formation): void {
    this.formulaire = {
      ...formation,
      dateFin: formation.dateFin || ''
    };

    this.formationId = formation.id;
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
    this.formationId = undefined;
  }

  enregistrer(): void {
    this.messageErreur = '';
    this.messageSucces = '';

    if (
      !this.formulaire.titre.trim() ||
      !this.formulaire.ecole.trim() ||
      !this.formulaire.niveau.trim() ||
      !this.formulaire.description.trim() ||
      !this.formulaire.dateDebut
    ) {
      this.messageErreur =
        'Remplis tous les champs obligatoires avant de continuer.';
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

    const donnees: Formation = {
      ...this.formulaire,
      titre: this.formulaire.titre.trim(),
      ecole: this.formulaire.ecole.trim(),
      niveau: this.formulaire.niveau.trim(),
      description: this.formulaire.description.trim(),
      dateFin: this.formulaire.dateFin || null
    };

    this.sauvegarde = true;

    const requete =
      this.modification && this.formationId !== undefined
        ? this.formationService.modifierFormation(
            this.formationId,
            donnees
          )
        : this.formationService.ajouterFormation(donnees);

    requete
      .pipe(finalize(() => this.sauvegarde = false))
      .subscribe({
        next: () => {
          this.formulaireVisible = false;
          this.formulaire = this.formulaireVide();
          this.formationId = undefined;

          this.messageSucces = this.modification
            ? 'Formation modifiée avec succès.'
            : 'Formation ajoutée avec succès.';

          this.chargerFormations();
        },
        error: (error) => {
          console.error('Erreur lors de l’enregistrement :', error);
          this.messageErreur =
            error?.error?.message ||
            'Échec de l’enregistrement. Vérifie la connexion au serveur.';
        }
      });
  }

  supprimerFormation(formation: Formation): void {
    if (formation.id === undefined || this.suppressionId !== null) {
      return;
    }

    const confirmer = window.confirm(
      `Veux-tu vraiment supprimer « ${formation.titre} » (${formation.ecole}) ?`
    );

    if (!confirmer) {
      return;
    }

    this.messageErreur = '';
    this.messageSucces = '';
    this.suppressionId = formation.id;

    this.formationService.supprimerFormation(formation.id)
      .pipe(finalize(() => this.suppressionId = null))
      .subscribe({
        next: () => {
          this.formations = this.formations.filter(
            (item) => item.id !== formation.id
          );
          this.messageSucces = 'Formation supprimée avec succès.';
        },
        error: (error) => {
          console.error('Erreur de suppression :', error);
          this.messageErreur =
            'Impossible de supprimer cette formation.';
        }
      });
  }

  afficherPeriode(formation: Formation): string {
    const debut = this.formaterDate(formation.dateDebut);
    const fin = formation.dateFin
      ? this.formaterDate(formation.dateFin)
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

  suivreFormation(index: number, formation: Formation): number | undefined {
    return formation.id ?? index;
  }
}
