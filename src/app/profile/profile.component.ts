import { Component } from '@angular/core';
import { BerkeService } from '../shared/services/berke.service';
import { CommonModule } from '@angular/common';
import { WindowDirective } from "../shared/directives/window.directive";

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    WindowDirective
],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  constructor(private berkeservice: BerkeService) { 
    this.selectedTheme = localStorage.getItem('user-theme') || 'sunrise';
  }

  selectedTheme!: string;
  themes = [
    {label: 'طلوع', value: 'sunrise'}, 
    {label: 'غروب', value: 'sunset'}, 
    {label: 'جنگل', value: 'forest'}
  ];

  themeChange(theme: string) {
    this.selectedTheme = theme;
    this.berkeservice.setTheme(theme as 'sunrise' | 'sunset' | 'forest');
  }

}
