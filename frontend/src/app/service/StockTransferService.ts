import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { map, Observable } from "rxjs";
import { StockTransfer, StockTransferPayload } from "../models/StockTransfer";


@Injectable({
  providedIn: 'root'
})

export class StockTransferService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/stock_transfers`;
  private readonly headers = new HttpHeaders({
    Accept: 'application/ld+json'
  });

  getStockTransfers(): Observable<StockTransfer[]> {
    return this.http.get<any>(this.apiUrl, {
      headers: this.headers
    }).pipe(
      map(response => {
        const transfers = response.member;

        if (!Array.isArray(transfers)) {
          throw new Error(
            'The API response does not contain a valid list of stock transfers.'
          );
        }
        return transfers as StockTransfer[];
      })
    );
  }

  getStockTransfer(id: number): Observable<StockTransfer> {
    return this.http.get<StockTransfer>(
      `${this.apiUrl}/${id}`,
      { headers: this.headers }
    );
  }

  createStockTransfer(data: StockTransferPayload): Observable<StockTransfer>
  {
    return this.http.post<StockTransfer>(this.apiUrl, data,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/ld+json',
          Accept: 'application/ld+json'
        })
      }
    );
  }

  updateStockTransfer(id: number, data: Partial<StockTransferPayload>): Observable<StockTransfer>
  {
    return this.http.patch<StockTransfer>(`${this.apiUrl}/${id}`, data,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/merge-patch+json',
          Accept: 'application/ld+json'
        })
      }
    );
  }
}
