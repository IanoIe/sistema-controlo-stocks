import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { environment } from "../../environments/environment";
import { Product } from "../models/product";
import { CreateProduct } from "../models/create-product";

interface ProductCollection {
  member: Product[];
  totalItems: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  // GET - All products
  getProducts(): Observable<Product[]> {

    return this.http
      .get<ProductCollection>(this.apiUrl)
      .pipe(
        map(response => response.member)
      );
  }

  // GET - Product by ID
  getProduct(id: number): Observable<Product> {

    return this.http.get<Product>(
      `${this.apiUrl}/${id}`
    );
  }

  // POST - Create product
  createProduct(product: CreateProduct): Observable<Product> {

    return this.http.post<Product>(
      this.apiUrl,
      product,
      {
        headers: {
          'Content-Type': 'application/ld+json',
          'Accept': 'application/ld+json'
        }
      }
    );
  }

  // PUT - Update product
  updateProduct(
    id: number,
    product: CreateProduct
  ): Observable<Product> {

    return this.http.put<Product>(
      `${this.apiUrl}/${id}`,
      product,
      {
        headers: {
          'Content-Type': 'application/ld+json',
          'Accept': 'application/ld+json'
        }
      }
    );
  }

  // DELETE - Delete product
  deleteProduct(id: number): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      {
        headers: {
          'Accept': 'application/ld+json'
        }
      }
    );
  }
}
