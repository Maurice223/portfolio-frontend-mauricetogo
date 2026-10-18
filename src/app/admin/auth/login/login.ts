
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  afficherMotDePasse = false;
  annee = new Date().getFullYear();

  motDePasse = '';
  erreur = '';
  chargement = false;

  connexion(): void {
    if (!this.email.trim() || !this.password) {
      this.error = 'Veuillez renseigner votre email et votre mot de passe.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.auth.login({
      email: this.email.trim(),
      password: this.password
    }).subscribe({
      next: (response) => {
        if (!response?.token) {
          this.error = 'Le serveur n’a pas retourné de jeton de connexion.';
          this.loading = false;
          return;
        }

        this.auth.saveToken(response.token);
        this.router.navigate(['/admin/dashboard']);
      },
      error: () => {
        this.error = 'Connexion impossible. Vérifiez vos identifiants.';
        this.loading = false;
      }
    });
  }
}
