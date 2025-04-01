import { Component, inject, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

interface LogEntry {
  date: Date;
  type: 'WORK' | 'PTO';
  startTime?: string;
  endTime?: string;
  duration: number; // Make this required
  durationSeconds?: number; // Add this property
  durationFormatted?: string; // Add this property
  description?: string;
}

@Component({
  selector: 'app-log-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './log-filter.component.html',
  styleUrls: ['./log-filter.component.scss'],
})
export class LogFilterComponent {
  startDate: Date | null;
  endDate: Date | null;
  sortOrder: 'asc' | 'desc' = 'asc';
  filteredLogs: LogEntry[] = [];
  isDarkTheme: boolean = false;
  
  private readonly snackBar = inject(MatSnackBar);
  private renderer = inject(Renderer2);

  constructor() {
    // Initialize with today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.startDate = today;
    this.endDate = today;

    this.isDarkTheme = localStorage.getItem('theme') === 'dark';
    this.applyTheme(); // Apply theme on init
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
    this.applyTheme();
  }
  private applyTheme() {
    if (this.isDarkTheme) {
      this.renderer.addClass(document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
    }
  }
  // Add this method to format seconds properly
  formatSeconds(seconds: number): string {
    if (seconds === undefined || seconds === null || isNaN(seconds)) {
      return '0s';
    }
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  }

  filterLogs(): void {
    if (!this.startDate || !this.endDate) {
      this.snackBar.open('Please select both start and end dates', 'Close', { duration: 3000 });
      return;
    }

    console.log('Filtering for dates:', {
      start: this.startDate.toISOString(),
      end: this.endDate.toISOString()
    });

    // Get stored entries
    const storedEntries = JSON.parse(localStorage.getItem('timeEntries') || '[]');
    console.log('All stored entries:', storedEntries);

    const startStr = this.startDate.toISOString().split('T')[0];
    const endStr = this.endDate.toISOString().split('T')[0];

    // Filter entries
    const logs = storedEntries.filter((entry: any) => {
      if (!entry.date) return false;
      const entryStr = new Date(entry.date).toISOString().split('T')[0];
      console.log(`Comparing entry date ${entryStr} with range ${startStr} - ${endStr}`);
      return entryStr >= startStr && entryStr <= endStr;
    });

    console.log('Filtered logs:', logs);

    
    // Map to LogEntry type
    this.filteredLogs = logs.map((entry: any) => ({
      date: new Date(entry.date),
      type: 'WORK',
      startTime: entry.startTime || '',
      endTime: entry.endTime || '',
      duration: entry.duration || 0,
      durationSeconds: entry.durationSeconds || entry.duration || 0, // Add this property
      durationFormatted: entry.durationFormatted || '', // Add this property
      description: entry.description || ''
    }));

    // Sort logs
    this.filteredLogs.sort((a, b) => {
      const comparison = a.date.getTime() - b.date.getTime();
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });

    console.log('Final filtered logs:', this.filteredLogs);
  }
}