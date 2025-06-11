import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { LogApiService, LogEntry } from '../log-api.service'; // Adjust path if needed
import { HttpClientModule } from '@angular/common/http';


export interface PtoRequest {
  ptoDate: string;
  submittedOn: string;
  reason: string;
  statuss: 'Pending' | 'Approved' | 'Rejected';
}

@Component({
  selector: 'app-pto',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    //HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatIconModule,
  ],
  templateUrl: './pto.component.html',
  styleUrls: ['./pto.component.scss'],
})
export class PtoComponent {
  totalPtoDays = 26;
  usedPtoDays = 0;
  ptoDays: PtoRequest[] = [];
  showReasonDialog = false;
  tempDate: Date | null = null;
  ptoReason: string = '';
  isDarkTheme = false;
  loading: boolean = false;

  constructor(private logApi: LogApiService) {
    // Theme from localStorage (optional)
    const savedTheme = localStorage.getItem('isDarkTheme');
    if (savedTheme) {
      this.isDarkTheme = JSON.parse(savedTheme);
      this.applyTheme();
    }
    this.fetchPtoDays();
  }

  openReasonDialog() {
    this.showReasonDialog = true;
  }

  fetchPtoDays() {
    this.loading = true;
    this.logApi.getPtoDays().subscribe({
      next: (response) => {
        // Strapi v4+ returns data as { data: [...] }
        const raw = response.data || response;
        this.ptoDays = raw.map((item: any) => ({
          ptoDate: item.attributes?.ptoDate || item.ptoDate,
          submittedOn: item.attributes?.submittedOn || item.submittedOn,
          reason: item.attributes?.reason || item.reason,
          statuss: item.attributes?.statuss || item.statuss,
        }));
        this.usedPtoDays = Math.min(this.ptoDays.length, this.totalPtoDays);
        this.loading = false;
      },
      error: () => {
        this.ptoDays = [];
        this.usedPtoDays = 0;
        this.loading = false;
      }
    });
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('isDarkTheme', JSON.stringify(this.isDarkTheme));
    this.applyTheme();
  }
  private applyTheme() {
    if (this.isDarkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  get remainingDays(): number {
    return this.totalPtoDays - this.usedPtoDays;
  }

  get progressPercentage(): number {
    return (this.usedPtoDays / this.totalPtoDays) * 100;
  }

  closeDialogIfClickedOutside(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.showReasonDialog = false;
    }
  }

 submitPto() {
  if (!this.tempDate || !this.ptoReason) {
    console.log('Please select a date and provide a reason for your PTO request');
    return;
  }

  // Format the ptoDate as YYYY-MM-DD (required date field)
  const formattedPtoDate = this.tempDate.toISOString().split('T')[0];
  
  // Format submittedOn as ISO string (required datetime field)
  const submittedOnDateTime = new Date().toISOString();

  // Create PTO request with the exact fields from your schema
  const ptoRequest: PtoRequest = {
    ptoDate: formattedPtoDate,       // Required Date field
    submittedOn: submittedOnDateTime, // Required Datetime field
    reason: this.ptoReason,          // Required Text field
    statuss: 'Pending'               // Required Enumeration field as defined in your interface
  };

  console.log('Submitting PTO request:', ptoRequest);

  this.logApi.createPtoDay(ptoRequest).subscribe({
    next: (response) => {
      console.log('PTO creation response:', response);
      console.log('PTO request submitted successfully');
      this.tempDate = null;          // Reset the date field
      this.ptoReason = '';           // Reset the reason field
      this.showReasonDialog = false; // Close the dialog
      this.fetchPtoDays();           // Refresh the list using your existing method
    },
    error: (err) => {
      console.error('Error creating PTO:', err);
      if (err.error && err.error.error) {
        console.error('Specific error details:', err.error.error);
      }
      console.error(`Failed to submit PTO request: ${err.error?.error?.message || err.message || 'Unknown error'}`);
    }
  });
}
}