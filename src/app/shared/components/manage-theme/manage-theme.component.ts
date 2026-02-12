import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BerkeService } from '../../services/berke.service';

@Component({
  selector: 'app-manage-theme',
  imports: [
    CommonModule
  ],
  templateUrl: './manage-theme.component.html',
  styleUrl: './manage-theme.component.css'
})
export class ManageThemeComponent {

  private berkeService = inject(BerkeService);
    selectedTheme: string | undefined;
  themes = [
    { label: 'طلوع', value: 'sunrise', background: 'linear-gradient(var(--p-pink-700), var(--p-purple-900), var(--p-purple-950))' },
    { label: 'غروب', value: 'sunset', background: 'linear-gradient(var(--p-purple-950), var(--p-purple-800), var(--p-orange-400))' },
    { label: 'صبح', value: 'morning', background: 'linear-gradient(var(--p-sky-600), var(--p-blue-300))' },
    { label: 'جنگل', value: 'forest', background: 'url("/assets/bg-images/forest.webp")' },
    { label: 'شفق', value: 'aurora', background: 'url("/assets/bg-images/aurora.webp")' },
    { label: 'کوه', value: 'mountain', background: 'url("/assets/bg-images/mountain.webp")' },
  ];

  
  themeChange(theme: string) {
    this.selectedTheme = theme;
    console.log(theme)
    this.berkeService.setTheme(theme as 'sunrise' | 'sunset' | 'forest' | 'aurora' | 'mountain' | 'morning');
  }

}
