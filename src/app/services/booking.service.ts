import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ApiResult{
  date : string;
  localName : string;
  name : string;
  global : boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private selectedDate: string | undefined;
  constructor(private http: HttpClient) {
   }

getHolidays(): Observable<ApiResult[]>{
    return this.http.get<ApiResult[]>(`${environment.baseUrl}/PublicHolidays/2025/IT`);
  }

setSelectedDate(date: string | undefined) {
     this.selectedDate = date;
   }

getSelectedDate(): string | undefined {
     return this.selectedDate;
    }

}
