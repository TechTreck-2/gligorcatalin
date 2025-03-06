import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';



export interface PtoRequest {
  ptoDate: string;
  submittedOn: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
  ],
  templateUrl: './pto.component.html',
  styleUrls: ['./pto.component.scss'],
})
export class PtoComponent {
  totalPtoDays = 26;
  usedPtoDays = 10;
  ptoDays: PtoRequest[] = [];
  showReasonDialog = false;
  tempDate: Date | null = null;
  ptoReason: string = '';

  openReasonDialog() {
    this.showReasonDialog = true;
  }

  submitPto() {
    if (this.tempDate && this.ptoReason) {
      const ptoDate = this.tempDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      const now = new Date();
      const submittedOn = `Submitted on: ${now.toLocaleDateString('en-GB')}, at ${now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })}`;

      this.ptoDays.push({
        ptoDate: ptoDate,
        submittedOn: submittedOn,
        reason: this.ptoReason,
        status: 'Pending'
      });
      
      this.usedPtoDays = Math.min(this.usedPtoDays + 1, this.totalPtoDays);
      this.showReasonDialog = false;
      this.tempDate = null;
      this.ptoReason = '';
    }
  }
}