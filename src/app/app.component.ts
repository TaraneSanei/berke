import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, inject, NgZone, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppState } from './state/app.state';
import { Store } from '@ngrx/store';
import { selectLoading } from './state/UI/ui.selectors';
import { BerkeService } from './shared/services/berke.service';
import { selectUser } from './state/user/user.selector';
import { getProfile } from './state/user/user.actions';
import { SupportService } from './shared/services/support.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {


  title = 'berke';
  loading$ :any;
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
