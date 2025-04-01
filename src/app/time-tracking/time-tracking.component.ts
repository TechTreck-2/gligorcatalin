import { Component, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { inject } from '@angular/core';


@Component({
  selector: 'app-time-tracking',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    HttpClientModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatDialogModule
  ],
  templateUrl: './time-tracking.component.html',
  styleUrls: ['./time-tracking.component.scss'],
  //encapsulation: ViewEncapsulation.None
})

export class TimeTrackingComponent implements OnInit {
  totalTimeWorked: number = 0;
  isTimerRunning: boolean = false;
  timer: any;
  clockInTime: Date | null = null;
  clockOutTime: Date | null = null;
  isPaused: boolean = false;
  data: any;
  isDarkTheme: boolean = false;
  selectedDate: Date = new Date();
  timeEntries: any[] = [];
  filteredEntries: any[] = [];

  //constructor(private http: HttpClient, private snackBar: MatSnackBar, private renderer: Renderer2, private dialog: MatDialog) {}
  // private http!: HttpClient;//!-assures that the variable is not null
  // private snackBar!: MatSnackBar;
  // private renderer!: Renderer2;
  // private dialog!: MatDialog;

  private readonly renderer = inject(Renderer2);
  private readonly http = inject(HttpClient);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  ngOnInit() {
    //this.fetchData();
    //this.initDep();
    this.selectedDate = new Date();
    this.selectedDate.setHours(0, 0, 0, 0);
    
    // Load stored entries
    this.loadEntries();
    
    // Filter entries for today's date
    this.filterEntries();
    
    // Restore other state
    this.restoreTimerState();
    this.restoreTheme();
  }

  // fetchData() {
  //   this.http.get<any[]>('https://jsonplaceholder.typicode.com/users')
  //     .subscribe((response: any[]) => {
  //       this.data = response;
  //       console.log(this.data);
  //     });
  // }

  startTimer() {
    this.clockInTime = new Date();  //Record the clock-in time
    this.totalTimeWorked = 0;
    this.isTimerRunning = true;
    this.isPaused = false;
    this.clockOutTime = null;  //Reset the clock-out time
    this.timer = setInterval(() => {
      this.totalTimeWorked++;
    }, 1000);
  }

  resumeTimer() {
    this.isTimerRunning = true;
    this.isPaused = false;
    this.clockOutTime = null;  // Reset the clock-out time
    this.timer = setInterval(() => {
      this.totalTimeWorked++;
    }, 1000);
  }

  stopTimer() {
    this.isTimerRunning = false;
    this.isPaused = true;
    this.clockOutTime = new Date();  // Record the clock-out time
    this.saveTimerState();
    clearInterval(this.timer);
  }

  resetTimer() {
    this.isTimerRunning = false;
    this.isPaused = false;
    this.totalTimeWorked = 0;
    this.clockInTime = null;
    this.clockOutTime = null;
    clearInterval(this.timer);
    this.saveTimerState();
  }

  saveTimerState() {
    const timerState = {
      totalTimeWorked: this.totalTimeWorked,
      isTimerRunning: this.isTimerRunning,
      clockInTime: this.clockInTime ? this.clockInTime.toISOString() : null,
      clockOutTime: this.clockOutTime ? this.clockOutTime.toISOString() : null,
      isPaused: this.isPaused
    };
    localStorage.setItem('timerState', JSON.stringify(timerState));
  }

  private formatDuration(seconds: number): string {
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

  private normalizeDate(date: Date): string {
    // Create a new date at midnight in local timezone
    const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return normalized.toISOString().split('T')[0];
}

  saveAndShowSnackBar() {
    this.saveTimerState();
    const entries = JSON.parse(localStorage.getItem('timeEntries') || '[]');
    
    const newEntry = {
      id: Date.now().toString(),
      date: this.normalizeDate(new Date()),
      // Store both formatted and raw seconds
      durationSeconds: this.totalTimeWorked,
      duration: this.totalTimeWorked, // Keep for backward compatibility
      durationFormatted: this.formatDuration(this.totalTimeWorked),
      startTime: this.clockInTime?.toLocaleTimeString(),
      endTime: this.clockOutTime?.toLocaleTimeString(),
      clockInTime: this.clockInTime?.toISOString(),
      clockOutTime: this.clockOutTime?.toISOString()
    };

    entries.push(newEntry);
    localStorage.setItem('timeEntries', JSON.stringify(entries));
    this.loadEntries();
    this.filterEntries();

    // const hours = Math.floor(this.totalTimeWorked / 3600);
    // const minutes = Math.floor((this.totalTimeWorked % 3600) / 60);
    // const formattedTime = `${hours} hours and ${minutes} minutes`;
    this.showSnackBar(`Timer state has been successfully registered! You have worked for ${newEntry.duration}`);
}

  showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

  restoreTimerState() {
    const timerState = localStorage.getItem('timerState');
    if (timerState) {
      const state = JSON.parse(timerState);
      this.totalTimeWorked = Number(state.totalTimeWorked) || 0;  // Ensure it's a number
      this.isTimerRunning = state.isTimerRunning;
      this.clockInTime = state.clockInTime ? new Date(state.clockInTime) : null;
      this.clockOutTime = state.clockOutTime ? new Date(state.clockOutTime) : null;
      this.isPaused = state.isPaused;

      if (this.isTimerRunning) {
        this.timer = setInterval(() => {
          this.totalTimeWorked++;
        }, 1000);
      }
    }
}

  getFormattedTime(seconds: number): string {
    const totalSeconds = Number(seconds);
    if (isNaN(totalSeconds)) return '00:00:00';
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;
    
    const paddedHours = hours < 10 ? '0' + hours : hours;
    const paddedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const paddedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
    
    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}

  restoreTheme() {
    const timerState = localStorage.getItem('timerState');
    if (timerState) {
      const state = JSON.parse(timerState);
      this.totalTimeWorked = Number(state.totalTimeWorked) || 0;
      const theme = localStorage.getItem('theme');
      if (theme === 'dark') {
        this.isDarkTheme = true;
        this.renderer.addClass(document.body, 'dark-theme');
      }
    }
    
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    if (this.isDarkTheme) {
      this.renderer.addClass(document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
    }
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }
  loadEntries(){
    this.timeEntries=JSON.parse(localStorage.getItem('timeEntries') || '[]');
  }
  
  filterEntries() {
    if (this.selectedDate) {
        // Format selected date as YYYY-MM-DD
        const selectedDateStr = new Date(this.selectedDate)
            .toISOString()
            .split('T')[0];
        
        console.log('Selected date:', selectedDateStr);

        this.filteredEntries = this.timeEntries.filter(entry => {
            // Convert entry date string to same format if it exists
            const entryDateStr = entry.date || 
                (entry.clockInTime ? new Date(entry.clockInTime).toISOString().split('T')[0] : null);

            if (!entryDateStr) return false;

            console.log('Comparing dates:', {
                selected: selectedDateStr,
                entry: entryDateStr,
                matches: entryDateStr === selectedDateStr
            });

            return entryDateStr === selectedDateStr;
        });

        console.log('Filtered entries:', this.filteredEntries);
    } else {
        this.filteredEntries = [];
    }
}
  
  editEntry(entry: any){
    //console.log('test', entry);
    this.showSnackBar('Nimic deocamdata');
  }
  
  deleteEntry(entry:any){
    const index = this.timeEntries.findIndex(e => e.id === entry.id);
  if (index !== -1) {
    this.timeEntries.splice(index, 1);
    localStorage.setItem('timeEntries', JSON.stringify(this.timeEntries));
    this.filterEntries(); //Refresh filtered list
    this.showSnackBar('Entry deleted successfully');
  }
  }
}
