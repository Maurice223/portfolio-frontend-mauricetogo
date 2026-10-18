import { ProjectsComponent } from './../../../components/projects/projects';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Projet } from '../../../model/projet';
import { ProjetService } from '../../../services/projet';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class AdminProjectsComponent implements OnInit {
  projets: Projet[] = [];
  recherche = '';

  chargement = false;
  enregistrement = false;
  erreur = '';
  succes = '';

  formulaireOuvert = false;
  modeEdition = false;
  projetId: number | null = null;

  formulaire: Projet = this.nouveauProjet();

  constructor(private projetService: ProjetService) { }

  ngOnInit(): void {
    this.chargerProjets();
  }

  nouveauProjet(): Projet {
    return {
      titre: '',
      description: '',
      image: '',
      technologies: '',
      lienGithub: '',
      lienDemo: '',
      dateCreation: new Date().toISOString().slice(0, 10)
    };
  }

  chargerProjets(): void {
    this.chargement = true;
    this.erreur = '';

    this.projetService.getProjets().subscribe({
      next: (donnees) => {
        this.projets = donnees ?? [];
        this.chargement = false;
      },
      error: (err) => {
        console.error('Erreur de chargement des projets :', err);
        this.erreur =
          'Impossible de charger les projets. Vérifie que le backend est démarré.';
        this.chargement = false;
      }
    });
  }

  get projetsFiltres(): Projet[] {
    const terme = this.recherche.trim().toLowerCase();

    if (!terme) {
      return this.projets;
    }

    return this.projets.filter((projet) =>
      [
        projet.titre,
        projet.description,
        projet.technologies
      ].some((valeur) => (valeur ?? '').toLowerCase().includes(terme))
    );
  }


  get totalProjets(): number {
    return this.projets.length;
  }

  get totalTechnologies(): number {
    const technologies = this.projets
      .flatMap(projet =>
        (projet.technologies || '')
          .split(',')
          .map(tech => tech.trim())
          .filter(tech => tech.length > 0)
      );

    return new Set(
      technologies.map(tech => tech.toLowerCase())
    ).size;
  }

  ouvrirCreation(): void {
    this.modeEdition = false;
    this.projetId = null;
    this.formulaire = this.nouveauProjet();
    this.erreur = '';
    this.succes = '';
    this.formulaireOuvert = true;
  }

  ouvrirModification(projet: Projet): void {
    if (projet.id == null) {
      this.erreur = 'Impossible de modifier ce projet : identifiant absent.';
      return;
    }

    this.modeEdition = true;
    this.projetId = projet.id;

    this.formulaire = {
      ...projet,
      dateCreation: (projet.dateCreation ?? '').slice(0, 10)
    };

    this.erreur = '';
    this.succes = '';
    this.formulaireOuvert = true;
  }

  fermerFormulaire(): void {
    if (this.enregistrement) {
      return;
    }

    this.formulaireOuvert = false;
    this.formulaire = this.nouveauProjet();
    this.projetId = null;
  }

  enregistrerProjet(): void {
    this.erreur = '';
    this.succes = '';

    const titre = this.formulaire.titre.trim();
    const description = this.formulaire.description.trim();

    if (!titre || !description) {
      this.erreur = 'Le titre et la description sont obligatoires.';
      return;
    }

    if (this.modeEdition && this.projetId == null) {
      this.erreur = 'Identifiant du projet introuvable.';
      return;
    }

    const donnees: Projet = {
      ...this.formulaire,
      titre,
      description,
      image: this.formulaire.image.trim(),
      technologies: this.formulaire.technologies.trim(),
      lienGithub: this.formulaire.lienGithub.trim(),
      lienDemo: this.formulaire.lienDemo.trim(),
      dateCreation:
        this.formulaire.dateCreation || new Date().toISOString().slice(0, 10)
    };

    this.enregistrement = true;

    const requete = this.modeEdition
      ? this.projetService.modifierProjet(this.projetId!, donnees)
      : this.projetService.ajouterProjet(donnees);

    requete.subscribe({
      next: () => {
        this.enregistrement = false;
        this.formulaireOuvert = false;
        this.formulaire = this.nouveauProjet();
        this.projetId = null;

        this.succes = this.modeEdition
          ? 'Projet modifié avec succès.'
          : 'Projet ajouté avec succès.';

        this.chargerProjets();
      },
      error: (err) => {
        console.error('Erreur lors de l’enregistrement :', err);
        this.enregistrement = false;
        this.erreur =
          err?.error?.message ??
          'Échec de l’enregistrement. Vérifie le backend et les données envoyées.';
      }
    });
  }

  supprimerProjet(projet: Projet): void {
    if (projet.id == null) {
      this.erreur = 'Impossible de supprimer ce projet : identifiant absent.';
      return;
    }

    const confirmation = window.confirm(
      `Voulez-vous vraiment supprimer le projet « ${projet.titre} » ? Cette action est irréversible.`
    );

    if (!confirmation) {
      return;
    }

    this.erreur = '';
    this.succes = '';

    this.projetService.supprimerProjet(projet.id).subscribe({
      next: () => {
        this.projets = this.projets.filter((p) => p.id !== projet.id);
        this.succes = 'Projet supprimé avec succès.';
      },
      error: (err) => {
        console.error('Erreur lors de la suppression :', err);
        this.erreur =
          err?.error?.message ?? 'Impossible de supprimer ce projet.';
      }
    });
  }

  ouvrirLien(url: string): void {
    if (url?.trim()) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  imageIndisponible(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.style.display = 'none';
  }
}