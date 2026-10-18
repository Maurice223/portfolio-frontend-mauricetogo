
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageContactService } from '../../services/contact';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class ContactComponent {
  success = false;
  errorMessage = '';
  erreur = '';
  envoi = false;
  submitted = false;

  message = {
    nom: '',
    email: '',
    sujet: '',
    message: ''
  };

  constructor(
    private contactService: MessageContactService,
    private cd: ChangeDetectorRef
  ) {}

  envoyer(): void {
    this.submitted = true;
    this.success = false;
    this.errorMessage = '';
    this.erreur = '';

    if (this.envoi) return;

    if (!this.message.nom.trim()) {
      this.erreur = 'Veuillez entrer votre nom.';
      return;
    }

    if (!this.emailValide(this.message.email)) {
      this.erreur = 'Veuillez entrer une adresse email valide.';
      return;
    }

    if (!this.message.message.trim()) {
      this.erreur = 'Veuillez écrire votre message.';
      return;
    }

    this.envoi = true;

    this.contactService.ajouter(this.message).subscribe({
      next: () => {
        this.success = true;
        this.envoi = false;
        this.message = {
          nom: '',
          email: '',
          sujet: '',
          message: ''
        };
        this.submitted = false;
        this.cd.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erreur lors de l’envoi :', err);
        this.envoi = false;
        this.errorMessage =
          'Une erreur est survenue lors de l’envoi du message.';
        this.cd.detectChanges();
      }
    });
  }

  emailValide(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
