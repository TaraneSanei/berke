import { CommonModule } from '@angular/common';
import { Component, Inject, inject, NgZone, OnDestroy, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppState } from './state/app.state';
import { Store } from '@ngrx/store';
import { selectLoading } from './state/UI/ui.selectors';
import { SupportService } from './shared/services/support.service';
import { Toast, ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    ToastModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {


  title = 'berke';
  loading$ :any;
  private messageService = inject(MessageService)
  private store = inject(Store<AppState>)
  private supportService = inject(SupportService)
  constructor() {
    this.loading$ = this.store.select(selectLoading);
  }

  ngOnInit(): void {
    this.supportService.hide()
  }



  openSupport (){
    this.supportService.open()
  }



  


  


}
