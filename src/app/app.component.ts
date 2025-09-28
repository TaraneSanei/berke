import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppState } from './state/app.state';
import { Store } from '@ngrx/store';
import { selectLoading } from './state/UI/ui.selectors';
import { BerkeService } from './services/berke.service';
import { selectUser } from './state/user/user.selector';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'berke';
  loading$ :any;
  constructor(private store: Store<AppState>) {
    this.loading$ = this.store.select(selectLoading);
  }

}
