import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements AfterViewInit {


  menuOuvert = false;

  sectionActive = 'hero';



  toggleMenu(){

    this.menuOuvert = !this.menuOuvert;

  }



  ngAfterViewInit(){


    const sections = document.querySelectorAll('section[id]');


    const options = {

      root: null,

      threshold: 0.6

    };



    const observer = new IntersectionObserver(

      entries => {


        entries.forEach(entry => {


          if(entry.isIntersecting){

            this.sectionActive = entry.target.id;

          }


        });


      },

      options

    );



    sections.forEach(section => {

      observer.observe(section);

    });


  }



}