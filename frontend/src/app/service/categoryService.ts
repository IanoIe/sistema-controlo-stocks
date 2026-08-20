import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Category {
  id: number;
  nameCategory: string;
}

interface CategoryCollection {
  member: Category[];
  totalItems: number;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<CategoryCollection>(this.apiUrl).pipe(
      map(response => response.member)
    );
  }
}
