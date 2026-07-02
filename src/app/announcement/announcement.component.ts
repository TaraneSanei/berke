import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SafeHtmlPipe } from '../shared/pipes/safe-html.pipe';
import { Announcement } from '../models/data.models';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { dismissAnnouncement } from '../state/announcement/announcement.actions';

@Component({
  selector: 'app-announcement',
  imports: [CommonModule, DialogModule, ButtonModule, SafeHtmlPipe],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.css'
})
export class AnnouncementComponent {
  visible = input<boolean>(false);
  announcement = input<Announcement | null>(null);
  private store = inject(Store<AppState>);
  close = output<void>();
  actionClicked = output<string>(); // Emit the link string to the parent

  dismiss() {
    
    if (this.announcement()) {
      const idd = this.announcement()?.id
      this.store.dispatch(dismissAnnouncement({ id: idd! }));
    }
    this.close.emit();
  }

  onAction() {
    const link = this.announcement()?.link;
    if (link) {
      this.actionClicked.emit(link);
    }
    this.dismiss();
  }
}