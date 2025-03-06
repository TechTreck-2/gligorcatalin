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

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private renderer: Renderer2, private dialog: MatDialog) {}

  ngOnInit() {
    this.fetchData();
    this.restoreTimerState();
    this.restoreTheme();
    this.loadEntries();
    this.filterEntries();
  }

  fetchData() {
    this.http.get<any[]>('https://jsonplaceholder.typicode.com/users')
      .subscribe((response: any[]) => {
        this.data = response;
        console.log(this.data);
      });
  }

  startTimer() {
    this.clockInTime = new Date();  // Record the clock-in time
    this.totalTimeWorked = 0;  // Reset the total time worked
    this.isTimerRunning = true;
    this.isPaused = false;
    this.clockOutTime = null;  // Reset the clock-out time
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

  saveAndShowSnackBar() {
    this.saveTimerState();

    const entries=JSON.parse(localStorage.getItem('timeEntries')|| '[]');

    const newEntry={
      id: Date.now().toString(),
      duration: this.totalTimeWorked,
      clockInTime: this.clockInTime?.toISOString(),
      clockOutTime: this.clockOutTime?.toISOString()
    };

    entries.push(newEntry);
    localStorage.setItem('timeEntries', JSON.stringify(entries));
    this.loadEntries();
    this.filterEntries();

    const hours = Math.floor(this.totalTimeWorked / 3600);
    const minutes = Math.floor((this.totalTimeWorked % 3600) / 60);
    const formattedTime = `${hours} hours and ${minutes} minutes`;
    this.showSnackBar(`Timer state has been successfully registered! You have worked for ${formattedTime}`);

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
      this.totalTimeWorked = state.totalTimeWorked;
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
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    const paddedHours = hours < 10 ? '0' + hours : hours;
    const paddedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const paddedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  }

  restoreTheme() {
    const theme = localStorage.getItem('theme');
    if (theme) {
      this.isDarkTheme = theme === 'dark';
      if (this.isDarkTheme) {
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
  
  filterEntries(){
    if (this.selectedDate) {
      const dateString = this.selectedDate.toISOString().split('T')[0];
      this.filteredEntries = this.timeEntries.filter(entry => {
        const entryDate = new Date(entry.clockInTime).toISOString().split('T')[0];
        return entryDate === dateString;
      });
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
