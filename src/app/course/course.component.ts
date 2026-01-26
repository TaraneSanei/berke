import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course, Track } from '../models/data.models';
import { DataService } from '../shared/services/data.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { WindowDirective } from '../shared/directives/window.directive';
import { PersianDigitsPipe } from '../shared/pipes/persian-digits.pipe';

@Component({
  selector: 'app-course',
  imports: [
    CommonModule,
    ButtonModule,
    WindowDirective,
    PersianDigitsPipe

  ],
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})

export class CourseComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  courseData = signal<Course | null>(null);
  constructor(){
  const id = Number(this.route.snapshot.paramMap.get('courseId'));
  this.dataService.getCourse(id.toString()).subscribe({
        next: (course) => {
            this.courseData.set(course);
            console.log(course)
        },
        error: (err) => { console.error('Failed to load course metadata:', err); }
    });
  }

    playTrack(track: Track) {
      this.router.navigate(['/play', track.id]);
    }

}
