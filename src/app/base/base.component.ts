import { Component, OnInit, } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { routes } from '../app.routes';
import { WindowDirective } from "../shared/directives/window.directive";
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { getProfile } from '../state/user/user.actions';

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

  constructor(private store: Store<AppState>){
  }
}

