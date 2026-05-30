// src/app/pipes/format-duration.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';

// Define the allowed format types for better type safety
type DurationFormat = 'auto' | 'mm:ss';

@Pipe({
  name: 'formatDuration',
  standalone: true
})
export class FormatDurationPipe implements PipeTransform {

  /**
   * Transforms seconds into a time format string.
   * @param totalSeconds The total duration in seconds.
   * @param format 'auto' (default) for H:MM:SS or M:SS, or 'mm:ss' to show total minutes.
   * @returns A formatted time string.
   */
  transform(totalSeconds: number | null | undefined, format: DurationFormat = 'auto'): string {
    // 1. Guard clause remains the same
    if (totalSeconds === null || totalSeconds === undefined || isNaN(totalSeconds) || totalSeconds < 0) {
      return '0:00';
    }

    // 2. Choose the formatting logic based on the 'format' parameter
    switch (format) {
      case 'mm:ss':
        return this.formatAsTotalMinutes(totalSeconds);
      
      case 'auto':
      default:
        return this.formatAsHoursAndMinutes(totalSeconds);
    }
  }

  /**
   * Formats into H:MM:SS (if hours > 0) or M:SS.
   */
  private formatAsHoursAndMinutes(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const paddedSeconds = String(seconds).padStart(2, '0');

    if (hours > 0) {
      const paddedMinutes = String(minutes).padStart(2, '0');
      return `${hours}:${paddedMinutes}:${paddedSeconds}`;
    } else {
      return `${minutes}:${paddedSeconds}`;
    }
  }

  /**
   * Formats into MM:SS, where MM is the total number of minutes.
   */
  private formatAsTotalMinutes(totalSeconds: number): string {
    const totalMinutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const paddedSeconds = String(seconds).padStart(2, '0');
    
    // Note: Minutes are NOT padded, as they can exceed two digits (e.g., 90:00)
    return `${totalMinutes}:${paddedSeconds}`;
  }
}
