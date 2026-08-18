import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { StockEntryModel, StockEntryCollection } from '../models/stock-entry';

@Injectable({
  providedIn: 'root'
})
export class StockEntryService {

  private apiUrl = `${environment.apiUrl}/stock_entries`;

  constructor(private http: HttpClient) {}

  getStockEntries(): Observable<StockEntryModel[]> {
    return this.http.get<StockEntryCollection>(this.apiUrl).pipe(
      map(response => response.member)
    );
  }
}
