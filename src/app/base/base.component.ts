import { Component, effect, ElementRef, inject, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { routes } from '../app.routes';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { SupportService } from '../shared/services/support.service';
import { filter } from 'rxjs';
import { MessageService } from 'primeng/api';
import { BerkeService } from '../shared/services/berke.service';

@Component({
  selector: 'app-base',
  imports: [
    RouterModule,
    ButtonModule,
],
providers: [MessageService],
  templateUrl: './base.component.html',
  styleUrl: './base.component.css'
})
export class BaseComponent {
  private berkeService = inject(BerkeService)
  private supportService = inject(SupportService)
  private router = inject(Router)
  scrollTop = 0;
  tabs = routes
  // activeError = this.berkeService.activeError
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  constructor(private store: Store<AppState>){
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.resetScroll();
    });

    // effect(() => {const error = this.activeError();
    //   if (error && error !== "") {
    //     this.showToast(error);
    //   }
    // });
  }

  openSupport (){
    this.supportService.open()
  }

  onScroll(event: any) {
    this.scrollTop = event.target.scrollTop;
  }

  private resetScroll() {
    this.scrollTop = 0;
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTo(0, 0);
    }
  }
  

}

