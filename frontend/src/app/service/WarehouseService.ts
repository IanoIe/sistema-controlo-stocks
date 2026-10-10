import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { environment } from "../../environments/environment";
import { Warehouse } from "../models/Warehouse";

interface WarehouseCollection {
  member: Warehouse[];
  totalItems: number;
}

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  private apiUrl = `${environment.apiUrl}/warehouses`;

  constructor(private http: HttpClient) {}

  // GET - All warehouses
  getWarehouses(): Observable<Warehouse[]> {

    return this.http
      .get<WarehouseCollection>(this.apiUrl)
      .pipe(
        map(response => response.member)
      );
  }

  // GET - Warehouse by ID
  getWarehouse(id: number): Observable<Warehouse> {

    return this.http.get<Warehouse>(
      `${this.apiUrl}/${id}`
    );
  }
}
