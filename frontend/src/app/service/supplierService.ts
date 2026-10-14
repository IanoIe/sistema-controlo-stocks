import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../environments/environment';
import { Supplier, SupplierPayload } from '../models/supplier';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/suppliers`;

  private readonly readHeaders = new HttpHeaders({
    Accept: 'application/ld+json'
  });

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<any>(this.apiUrl, {
      headers: this.readHeaders
    }).pipe(
      map(response => {
        const suppliers = Array.isArray(response)
          ? response
          : response?.member;

        if (!Array.isArray(suppliers)) {
          throw new Error(
            'The API response does not contain a valid list of suppliers.'
          );
        }

        return suppliers as Supplier[];
      })
    );
  }

  createSupplier(data: SupplierPayload): Observable<Supplier> {
    return this.http.post<Supplier>(this.apiUrl, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/ld+json',
        Accept: 'application/ld+json'
      })
    });
  }

  updateSupplier(
    id: number,
    data: Partial<SupplierPayload>
  ): Observable<Supplier> {
    return this.http.patch<Supplier>(
      `${this.apiUrl}/${id}`,
      data,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/merge-patch+json',
          Accept: 'application/ld+json'
        })
      }
    );
  }
}
