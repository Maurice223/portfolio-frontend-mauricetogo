
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { Message } from '../../../model/message-contact';
import { MessageContactService } from '../../../services/contact';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class AdminMessagesComponent implements OnInit {
  private readonly messageService = inject(MessageContactService);

  messages: Message[] = [];
  recherche = '';
  chargement = false;
  suppressionEnCours: number | null = null;
  erreur = '';
  succes = '';
  messageSelectionne: Message | null = null;
  modalOuvert = false;

  ngOnInit(): void {
    this.chargerMessages();
  }

  get messagesFiltres(): Message[] {
    const terme = this.recherche.trim().toLocaleLowerCase();

    const resultat = this.messages.filter((message) => {
      const contenu = [
        message.nom,
        message.email,
        message.sujet,
        message.message
      ].filter(Boolean).join(' ').toLocaleLowerCase();

      return !terme || contenu.includes(terme);
    });

    return resultat.sort((a, b) => {
      const dateA = a.dateEnvoi ? new Date(a.dateEnvoi).getTime() : 0;
      const dateB = b.dateEnvoi ? new Date(b.dateEnvoi).getTime() : 0;
      return dateB - dateA;
    });
  }

  get messagesRecents(): number {
    const maintenant = Date.now();
    const septJours = 7 * 24 * 60 * 60 * 1000;

    return this.messages.filter((message) => {
      if (!message.dateEnvoi) return false;

      const date = new Date(message.dateEnvoi).getTime();

      return !Number.isNaN(date) &&
        date >= maintenant - septJours &&
        date <= maintenant;
    }).length;
  }

  chargerMessages(): void {
    this.chargement = true;
    this.erreur = '';
    this.succes = '';

    this.messageService.getMessages()
      .pipe(finalize(() => this.chargement = false))
      .subscribe({
        next: (messages) => {
          this.messages = messages ?? [];
        },
        error: (error) => {
          console.error('Erreur de chargement des messages :', error);

          if (error.status === 401 || error.status === 403) {
            this.erreur =
              'Accès refusé. Vérifie ton authentification et les autorisations du backend.';
          } else {
            this.erreur =
              'Impossible de charger les messages. Vérifie que le backend est démarré.';
          }
        }
      });
  }

  ouvrirMessage(message: Message): void {
    this.messageSelectionne = message;
    this.modalOuvert = true;
    this.succes = '';
  }

  fermerMessage(): void {
    this.modalOuvert = false;
    this.messageSelectionne = null;
  }

  supprimerMessage(message: Message): void {
    if (message.id == null) {
      this.erreur = 'Impossible de supprimer ce message : identifiant absent.';
      return;
    }

    const confirmation = window.confirm(
      `Supprimer définitivement le message de ${message.nom} ?`
    );

    if (!confirmation) return;

    this.suppressionEnCours = message.id;
    this.erreur = '';
    this.succes = '';

    this.messageService.supprimerMessage(message.id)
      .pipe(finalize(() => this.suppressionEnCours = null))
      .subscribe({
        next: () => {
          this.messages = this.messages.filter(
            (element) => element.id !== message.id
          );

          if (this.messageSelectionne?.id === message.id) {
            this.fermerMessage();
          }

          this.succes = 'Le message a été supprimé.';
        },
        error: (error) => {
          console.error('Erreur de suppression :', error);
          this.erreur = error.status === 404
            ? 'Ce message a déjà été supprimé ou n’existe plus.'
            : 'La suppression a échoué. Vérifie les autorisations du backend.';
        }
      });
  }

  formaterDate(date?: string): string {
    if (!date) return 'Date inconnue';

    const valeur = new Date(date);

    if (Number.isNaN(valeur.getTime())) return 'Date inconnue';

    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(valeur);
  }

  initiales(nom: string): string {
    return nom
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((partie) => partie.charAt(0).toUpperCase())
      .join('') || '?';
  }

  actualiser(): void {
    this.chargerMessages();
  }
}
