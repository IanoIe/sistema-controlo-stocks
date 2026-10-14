import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  StockEntryModel,
  StockEntryCollection
} from '../models/stock-entry';

@Injectable({
  providedIn: 'root'
})
export class StockEntryService {

  private apiUrl = `${environment.apiUrl}/stock_entries`;

  constructor(private http: HttpClient) {}

  getStockEntries(): Observable<StockEntryModel[]> {
    return this.http
      .get<StockEntryCollection>(this.apiUrl)
      .pipe(map(response => response.member));
  }

  createStockEntry(data: {
    quantity: number;
    dateStockEntry: string;
    product: string;
    reason?: string;
    notes?: string;
    user?: string;
    }):
    Observable<StockEntryModel> {
      return this.http.post<StockEntryModel>(this.apiUrl,data,
        {
          headers: {
            'Content-Type': 'application/ld+json',
            'Accept': 'application/ld+json'
          }
        }
     );
  }
}
