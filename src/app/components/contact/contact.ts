import { Component, ChangeDetectorRef } from '@angular/core';
import { MessageService } from '../../services/contact';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    FormsModule
  ],
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
    private contactService: MessageService,
    private cd: ChangeDetectorRef
  ) { }





  envoyer() {


    console.log("🟦 Bouton envoyer cliqué");


    this.submitted = true;

    this.success = false;

    this.errorMessage = '';

    this.erreur = '';




    if (this.envoi) {

      return;

    }




    // Validation nom

    if (!this.message.nom.trim()) {

      this.erreur = "Veuillez entrer votre nom";

      return;

    }





    // Validation email

    if (!this.message.email.trim()) {

      this.erreur = "Veuillez entrer votre email";

      return;

    }



    if (!this.emailValide(this.message.email)) {

      this.erreur = "Veuillez entrer une adresse email valide";

      return;

    }






    // Validation message

    if (!this.message.message.trim()) {

      this.erreur = "Veuillez écrire votre message";

      return;

    }







    console.log("📤 Données envoyées :", this.message);



    this.envoi = true;





    this.contactService.ajouter(this.message)

      .subscribe({



        next: () => {

          console.log("✅ Message envoyé avec succès");


          this.success = true;

          this.envoi = false;


          this.cd.detectChanges();

          setTimeout(() => {
            this.success = false;
            this.cd.detectChanges();
          }, 5000);
        },


        error: (err) => {



          console.error(
            "❌ Erreur lors de l'envoi :",
            err
          );



          this.envoi = false;



          this.errorMessage =

            "Une erreur est survenue lors de l'envoi du message.";



        }



      });



  }








  emailValide(email: string): boolean {


    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


  }



}