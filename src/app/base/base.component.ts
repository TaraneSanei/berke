import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { routes } from '../app.routes';
import { WindowDirective } from "../shared/directives/window.directive";

@Component({
  selector: 'app-base',
  imports: [
    RouterModule,
    ButtonModule,
    WindowDirective
],
  templateUrl: './base.component.html',
  styleUrl: './base.component.css'
})
export class BaseComponent {
  
  tabs = routes

  constructor(){}
}
