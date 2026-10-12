import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Warehouse, WarehousePayload } from '../models/Warehouse';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/warehouses`;
  getWarehouses(): Observable<Warehouse[]> {
    return this.http.get<any>(this.apiUrl, {
      headers: new HttpHeaders({
        Accept: 'application/ld+json'
      })
    })
    .pipe(
      map(response => {
        console.log('Resposta original da API:', response);
        const warehouses = response.member;
        if (!Array.isArray(warehouses)) {
          throw new Error(
            'The API response does not contain a valid member array.'
          );
        }
        return warehouses as Warehouse[];
      })
    );
  }

  createWarehouse(data: WarehousePayload): Observable<Warehouse> {
    return this.http.post<Warehouse>(this.apiUrl, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/ld+json',
        'Accept': 'application/ld+json'
      })
    });
  }

  updateWarehouse(id: number, data: WarehousePayload): Observable<Warehouse> {
    return this.http.patch<Warehouse>(
      `${this.apiUrl}/${id}`,
      data,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/merge-patch+json',
          'Accept': 'application/ld+json'
        })
      }
    );
  }
}
