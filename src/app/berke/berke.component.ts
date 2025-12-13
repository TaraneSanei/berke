import { Component, inject } from '@angular/core';
import { WindowDirective } from '../shared/directives/window.directive';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-berke',
  imports: [
    WindowDirective,
    ButtonModule,
    FloatLabelModule,
    DatePickerModule,
    TextareaModule,
    MultiSelectModule
  ],
  templateUrl: './berke.component.html',
  styleUrl: './berke.component.css'
})
export class BerkeComponent {

  private router = inject(Router);

  journal() {
    this.router.navigate(['/journal']);
  }
}
