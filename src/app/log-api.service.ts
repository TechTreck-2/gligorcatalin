import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LogEntry {
  date: Date;
  type: 'WORK' | 'PTO';
  startTime?: string;
  endTime?: string;
  duration: number;
  durationSeconds?: number;
  durationFormatted?: string;
  description?: string;
  statuss?: string;
}

export interface PtoRequest {
  ptoDate: string;
  submittedOn: string;
  reason: string;
  statuss: 'Pending' | 'Approved' | 'Rejected';
}

@Injectable({
  providedIn: 'root'
})
export class LogApiService {
  private logsUrl = 'http://localhost:1337/api/logs';
  private timeEntriesUrl = 'http://localhost:1337/api/time-entries';
  private ptoDaysUrl = 'http://localhost:1337/api/pto-days';

  constructor(private http: HttpClient) {}

  // Get ALL logs (not filtered)
  getLogs(): Observable<any> {
    return this.http.get<any>(this.logsUrl);
  }

  // Get time entries, optionally filtered by start and end ISO string (YYYY-MM-DD)
  getTimeEntries(start?: string, end?: string): Observable<any> {
    let url = this.timeEntriesUrl;
    if (start && end) {
      url += `?filters[date][$gte]=${start}&filters[date][$lte]=${end}`;
    }
    return this.http.get<any>(url);
  }

  // Get PTO days, optionally filtered by start and end ISO string (YYYY-MM-DD)
  getPtoDays(start?: string, end?: string): Observable<any> {
    let url = this.ptoDaysUrl;
    if (start && end) {
      url += `?filters[ptoDate][$gte]=${start}&filters[ptoDate][$lte]=${end}`;
    }
    return this.http.get<any>(url);
  }

  getLogById(id: number): Observable<any> {
    return this.http.get<any>(`${this.logsUrl}/${id}`);
  }

  createLog(log: Partial<LogEntry>): Observable<any> {
    return this.http.post<any>(this.logsUrl, { data: log });
  }

  updateLog(id: number, log: Partial<LogEntry>): Observable<any> {
    return this.http.put<any>(`${this.logsUrl}/${id}`, { data: log });
  }

  deleteLog(id: number): Observable<any> {
    return this.http.delete<any>(`${this.logsUrl}/${id}`);
  }

  createPtoDay(pto: Partial<PtoRequest>): Observable<any> {
    return this.http.post<any>(this.ptoDaysUrl, { data: pto });
  }

  createTimeEntry(entry: any): Observable<any> {
  // Add the required type field if not present
  if (!entry.type) {
    entry.type = 'WORK';
  }
  
  // Add the status field if not present
  if (!entry.statuss) {
    entry.statuss = 'Pending';
  }
  
  console.log('Sending to API:', { data: entry });
  return this.http.post<any>(this.timeEntriesUrl, { data: entry });
}

  deleteTimeEntry(id: number): Observable<any> {
    return this.http.delete<any>(`${this.timeEntriesUrl}/${id}`);
  }
}