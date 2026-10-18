
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { Competence } from '../../../model/competence';
import { CompetenceService } from '../../../services/competence';

@Component({
  selector: 'app-admin-skills',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './skills.html',
  styleUrl: './skills.css'
})
export class AdminSkillsComponent implements OnInit {
  competences: Competence[] = [];

  recherche = '';
  categorieSelectionnee = 'Toutes';

  chargement = false;
  enregistrement = false;
  formulaireOuvert = false;
  modeModification = false;

  erreur = '';
  succes = '';

  competenceSelectionnee: number | null = null;

  formulaire: Competence = this.nouvelleCompetence();

  constructor(private competenceService: CompetenceService) {}

  ngOnInit(): void {
    this.chargerCompetences();
  }

  nouvelleCompetence(): Competence {
    return {
      nom: '',
      niveau: 70,
      categorie: ''
    };
  }

  chargerCompetences(): void {
    this.chargement = true;
    this.erreur = '';

    this.competenceService.getCompetences()
      .pipe(finalize(() => this.chargement = false))
      .subscribe({
        next: (data) => {
          this.competences = data ?? [];
        },
        error: (error) => {
          console.error('Erreur de chargement des compétences :', error);
          this.erreur = 'Impossible de charger les compétences. Vérifie que le backend est démarré.';
        }
      });
  }

  get categories(): string[] {
    return [
      ...new Set(
        this.competences
          .map(c => (c.categorie || '').trim())
          .filter(c => c.length > 0)
      )
    ].sort((a, b) => a.localeCompare(b));
  }

  get competencesFiltrees(): Competence[] {
    const terme = this.recherche.trim().toLowerCase();

    return this.competences.filter(c => {
      const correspondRecherche =
        (c.nom || '').toLowerCase().includes(terme) ||
        (c.categorie || '').toLowerCase().includes(terme);

      const correspondCategorie =
        this.categorieSelectionnee === 'Toutes' ||
        c.categorie === this.categorieSelectionnee;

      return correspondRecherche && correspondCategorie;
    });
  }

  get totalCompetences(): number {
    return this.competences.length;
  }

  get moyenneNiveau(): number {
    if (!this.competences.length) return 0;

    const total = this.competences.reduce(
      (somme, c) => somme + Number(c.niveau || 0),
      0
    );

    return Math.round(total / this.competences.length);
  }

  get competencesAvancees(): number {
    return this.competences.filter(c => Number(c.niveau) >= 80).length;
  }

  ouvrirCreation(): void {
    this.formulaire = this.nouvelleCompetence();
    this.competenceSelectionnee = null;
    this.modeModification = false;
    this.formulaireOuvert = true;
    this.erreur = '';
    this.succes = '';
  }

  ouvrirModification(competence: Competence): void {
    if (competence.id == null) {
      this.erreur = 'Cette compétence ne possède pas d’identifiant valide.';
      return;
    }

    this.formulaire = { ...competence };
    this.competenceSelectionnee = competence.id;
    this.modeModification = true;
    this.formulaireOuvert = true;
    this.erreur = '';
    this.succes = '';
  }

  fermerFormulaire(): void {
    if (this.enregistrement) return;

    this.formulaireOuvert = false;
    this.formulaire = this.nouvelleCompetence();
    this.competenceSelectionnee = null;
  }

  enregistrerCompetence(): void {
    this.erreur = '';
    this.succes = '';

    const nom = this.formulaire.nom.trim();
    const categorie = this.formulaire.categorie.trim();
    const niveau = Number(this.formulaire.niveau);

    if (!nom || !categorie) {
      this.erreur = 'Le nom et la catégorie sont obligatoires.';
      return;
    }

    if (!Number.isFinite(niveau) || niveau < 0 || niveau > 100) {
      this.erreur = 'Le niveau doit être compris entre 0 et 100.';
      return;
    }

    const doublon = this.competences.some(c =>
      (c.nom || '').trim().toLowerCase() === nom.toLowerCase() &&
      (c.categorie || '').trim().toLowerCase() === categorie.toLowerCase() &&
      c.id !== this.competenceSelectionnee
    );

    if (doublon) {
      this.erreur = 'Cette compétence existe déjà dans cette catégorie.';
      return;
    }

    const donnees: Competence = { nom, categorie, niveau };

    this.enregistrement = true;

    const requete = this.modeModification && this.competenceSelectionnee !== null
      ? this.competenceService.modifierCompetence(
          this.competenceSelectionnee,
          donnees
        )
      : this.competenceService.ajouterCompetence(donnees);

    requete
      .pipe(finalize(() => this.enregistrement = false))
      .subscribe({
        next: () => {
          this.formulaireOuvert = false;
          this.succes = this.modeModification
            ? 'Compétence modifiée avec succès.'
            : 'Compétence ajoutée avec succès.';

          this.chargerCompetences();
        },
        error: (error) => {
          console.error('Erreur lors de l’enregistrement :', error);
          this.erreur = error?.error?.message ||
            'Échec de l’enregistrement. Vérifie le backend et les données.';
        }
      });
  }

  supprimerCompetence(competence: Competence): void {
    if (competence.id == null) {
      this.erreur = 'Impossible de supprimer cette compétence : identifiant absent.';
      return;
    }

    const confirme = window.confirm(
      `Veux-tu vraiment supprimer « ${competence.nom} » ? Cette action est irréversible.`
    );

    if (!confirme) return;

    this.erreur = '';
    this.succes = '';

    this.competenceService.supprimerCompetence(competence.id)
      .subscribe({
        next: () => {
          this.competences = this.competences.filter(
            c => c.id !== competence.id
          );
          this.succes = `La compétence « ${competence.nom} » a été supprimée.`;
        },
        error: (error) => {
          console.error('Erreur lors de la suppression :', error);
          this.erreur = 'La suppression a échoué. Vérifie le backend.';
        }
      });
  }

  reinitialiserFiltres(): void {
    this.recherche = '';
    this.categorieSelectionnee = 'Toutes';
  }

  trackById(index: number, competence: Competence): number {
    return competence.id ?? index;
  }
}
