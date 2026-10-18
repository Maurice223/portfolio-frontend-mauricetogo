import { Component } from '@angular/core';
import AOS from 'aos';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {


constructor(){

  AOS.init({
    duration:1000,
    once:true,
    offset:100
  });

}


}