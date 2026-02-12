import { Component, inject } from '@angular/core';
import { WindowDirective } from '../shared/directives/window.directive';
import { SupportService } from '../shared/services/support.service';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  imports: [
    WindowDirective,
    ToastModule,
    ButtonModule
  ],
  templateUrl: './start.component.html',
  styleUrl: './start.component.css'
})
export class StartComponent {
  private supportService = inject(SupportService)
  private router = inject(Router)

  openSupport (){
    this.supportService.open()
  }

  login(){
    this.router.navigate(['/login'])
  }

  signup(){
    this.router.navigate(['/signup'])
  }
}
