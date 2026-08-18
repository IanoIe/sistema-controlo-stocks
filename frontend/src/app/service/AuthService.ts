import { computed, inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { User } from "../models/user";
import { AuthPayload } from "../models/auth-payload";
import { environment } from "../../environments/environment";

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

  private readonly userSignal = signal<User | null>(null);
  readonly currentUser = this.userSignal.asReadonly();

  readonly isAuthenticated = computed(
    () => this.userSignal() !== null
  );

  login(payload: AuthPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login_check`,
      payload
    ).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  loadCurrentUser(): Observable<User | null> {
    return this.http.get<User>(
      `${this.apiUrl}/me`
    ).pipe(
      tap(user => {
        this.userSignal.set(user);
      })
    );
  }

  logout(): Observable<void> {
    localStorage.removeItem('token');
    this.userSignal.set(null);

    return new Observable<void>(observer => {
      observer.next();
      observer.complete();
    });
  }
}
