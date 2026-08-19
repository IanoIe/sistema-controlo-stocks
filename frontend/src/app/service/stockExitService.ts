import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { StockExitCollection, StockExitModel } from "../models/stock-exit";



@Injectable({
  providedIn: 'root'
})

export class StockExitService {
  private apiUrl = `${environment.apiUrl}/stock_exits`;

  constructor(private http: HttpClient){}

  getStockExits(): Observable<StockExitModel[]> {
    return this.http.get<StockExitCollection>(this.apiUrl).pipe(
      map(Response => Response.member)
    );
  }
}
